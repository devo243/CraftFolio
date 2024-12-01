import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, BeginnerFriendlyRating, CommentOnPost, EcoFriendlyRating, GuideInventorying, Inventorying, Posting, ProjectInventorying, ProjectManaging, Sessioning } from "./app";
import { PostDoc, PostHelpOptions, PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";
import { CommentOptions } from "./concepts/commenting";
import { NotAllowedError } from "./concepts/errors";
import { FiberDoc } from "./concepts/inventorying";
import { RatingDoc } from "./concepts/rating";

const ECO_FRIENDLY_FIBERS = ["organic hemp", "organic cotton", "organic linen", "lyocell", "econyl", "pinatex", "qmonos", "bamboo"];

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  @Router.validate(z.object({ author: z.string().optional() }))
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await Authing.getUserByUsername(author))._id;
      posts = await Posting.getByAuthor(id);
    } else {
      posts = await Posting.getPosts();
    }
    return Responses.posts(posts);
  }

  private calculateEcoRating(fiber_types: string[][]) {
    const total_fibers = fiber_types.length;
    const eco_friendly_count = fiber_types.filter((fiber_row) => ECO_FRIENDLY_FIBERS.includes(fiber_row[2]?.toLowerCase())).length;
    return total_fibers > 0 ? (eco_friendly_count / total_fibers) * 5 : 0;
  }

  private calculateBeginnerRating(options?: PostHelpOptions) {
    const tips_count = options?.tips?.length || 0;
    const mistakes_count = options?.mistakes?.length || 0;
    const max_tips_mistakes = 3;

    return Math.min(((tips_count + mistakes_count) / max_tips_mistakes) * 5, 5);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostHelpOptions, fiber_types?: string[][], fiber_yardages?: number[][]) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, content, options);
    const post_id = created.post?._id;
    if (!post_id) {
      throw new Error(created.msg);
    }
    // adds fibers to the inventory for guides
    // TODO: currently only takes in yardage and type
    if (fiber_types && fiber_yardages) {
      const guide_fibers = await Promise.all(
        fiber_types.map(async (fiber_type_alternatives: string[], idx: number) =>
          (
            await Promise.all(
              fiber_type_alternatives.map((fiber_type_alternative: string, fiber_type_alternative_idx: number) =>
                GuideInventorying.addNewFiber(post_id, "", "", fiber_type_alternative, "", fiber_yardages[idx][fiber_type_alternative_idx]),
              ),
            )
          ).map((fiber_msg) => fiber_msg.fiber?._id),
        ),
      );
      const created_fibers = guide_fibers.map((fiber_ids) => fiber_ids.filter((fiber_id) => fiber_id !== undefined));
      await Posting.update(post_id, undefined, { fibers: created_fibers });
    }

    const eco_rating = this.calculateEcoRating(fiber_types || []);
    const beginner_rating = this.calculateBeginnerRating(options);
    await EcoFriendlyRating.create(post_id, eco_rating);
    await BeginnerFriendlyRating.create(post_id, beginner_rating);

    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  // to update anything fiber realted use addNewFiberToPost, editFiberInGuide, deleteFiberInPost
  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions, fiber_types?: string[][]) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);

    const eco_rating = this.calculateEcoRating(fiber_types || []);
    const beginner_rating = this.calculateBeginnerRating(options);
    await EcoFriendlyRating.update(oid, eco_rating);
    await BeginnerFriendlyRating.update(oid, beginner_rating);

    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    // delete all the fibers related to the post
    await GuideInventorying.deleteOwnersFibers(oid);
    await EcoFriendlyRating.delete(oid);
    await BeginnerFriendlyRating.delete(oid);
    return Posting.delete(oid);
  }

  @Router.get("/posts/top")
  @Router.validate(z.object({ minScore: z.number().optional(), ratingType: z.enum(["eco", "beginner"]) }))
  async getTopPosts(ratingType: "eco" | "beginner", minScore: number = 0) {
    const Rating = ratingType === "eco" ? EcoFriendlyRating : BeginnerFriendlyRating;
    const ratings = (await (await Rating.getObjectsWithMinRating(minScore)).toArray()) as RatingDoc[];
    const posts = await Promise.all(
      ratings.map(async (rating: RatingDoc) => {
        const post = await Posting.getById(rating.object);
        return post ? { ...post, rating: rating.rating } : null;
      }),
    );
    return posts;
  }

  async getGuidesWith(availbaleFibers: ObjectId[]) {
    const allGuides: PostDoc[] = await Posting.getPosts();
    const usableGuides: PostDoc[] = [];
    // this is not foolproof: especially if a type of fabric is mentionaed across multiple arrays
    for (const guide of allGuides) {
      let isUsableGuide = true;
      const guideFibers = guide.options?.fibers ?? [];
      for (const guideFiberOptions of guideFibers) {
        if (guideFiberOptions.every((guidefiber: ObjectId) => availbaleFibers.every((available_fiber) => available_fiber < guidefiber))) {
          isUsableGuide = false;
        }
      }
      if (isUsableGuide) {
        usableGuides.concat([guide]);
      }
    }
    return usableGuides;
  }

  @Router.post("/posts/:id/fibers")
  async addNewFiberToPost(session: SessionDoc, id: string, alternative_to: string, type: string, yardage: number) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    const created = await GuideInventorying.addNewFiber(oid, "", "", type, "", yardage);
    if (created.fiber !== null) {
      const altid = new ObjectId(alternative_to);
      const existing_fiber = await Posting.getFibersForPost(oid);
      const new_fibers = existing_fiber?.map((fibers: ObjectId[]) => (alternative_to in fibers.map((fiber) => fiber.toString()) ? fibers.concat([altid]) : fibers));
      return await Posting.update(oid, undefined, { fibers: new_fibers });
    } else {
      return created.msg;
    }
  }

  @Router.patch("/posts/:id/fibers/:fiber_id")
  async editFiberInGuide(session: SessionDoc, id: string, fiber_id: string, name?: string, brand?: string, type?: string, color?: string, yardage?: number) {
    const user = Sessioning.getUser(session); // the user is considered the author of the guide
    const oid = new ObjectId(id); // the guide is considered the owner of the inventory
    const fid = new ObjectId(fiber_id);
    await Posting.assertAuthorIsUser(user, oid);
    await GuideInventorying.assertOwnerIsUser(fid, oid);
    return GuideInventorying.editFiber(fid, name, brand, type, color, yardage);
  }

  @Router.delete("/posts/:id/fibers/:fiber_id")
  async deleteFiberInPost(session: SessionDoc, id: string, fiber_id: string) {
    const user = Sessioning.getUser(session); // the user is considered the author of the guide
    const oid = new ObjectId(id); // the guide is considered the owner of the inventory
    const fid = new ObjectId(fiber_id);
    console.log(fid);
    await Posting.assertAuthorIsUser(user, oid);
    await GuideInventorying.assertOwnerIsUser(fid, oid);
    const existing_fibers = await Posting.getFibersForPost(oid);
    const new_fibers = existing_fibers?.map((existing_fiber_alternatives: ObjectId[]) => existing_fiber_alternatives.filter((existing_fiber: ObjectId) => existing_fiber !== fid));
    await Posting.update(oid, undefined, { fibers: new_fibers });
    return await GuideInventorying.deleteFiber(fid);
  }

  //Comments on Posts
  @Router.patch("/posts/:pid/comments/:id")
  async updateCommentOnPost(session: SessionDoc, pid: string, id: string, content?: string, options?: CommentOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await CommentOnPost.assertAuthorIsUser(oid, user);
    return await CommentOnPost.update(oid, content, options);
  }

  @Router.delete("/posts/:pid/comments/:id")
  async deleteCommentOnPost(session: SessionDoc, pid: string, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await CommentOnPost.assertAuthorIsUser(oid, user);
    return CommentOnPost.delete(oid);
  }

  @Router.get("/posts/:pid/comments")
  @Router.validate(z.object({ pid: z.string() }))
  async getCommentsOnPosts(pid: string) {
    const id = new ObjectId(pid);
    const comments = await CommentOnPost.getByItem(id);

    return Responses.comments(comments);
  }
  @Router.post("/posts/:pid/comments")
  async createCommentOnPost(session: SessionDoc, pid: string, content: string, options?: CommentOptions) {
    const user = Sessioning.getUser(session);
    const itemID = new ObjectId(pid);
    await Posting.assertPostExists(itemID); //check if that post exists!
    const created = await CommentOnPost.create(itemID, user, content, options);
    return { msg: created.msg, comment: await Responses.comment(created.comment) };
  }

  // INVENTORY CONCEPT
  @Router.post("/fibers")
  async createFiber(session: SessionDoc, name: string, yardage: number, type: string, brand?: string, color?: string) {
    const user = Sessioning.getUser(session);
    const created = await Inventorying.addNewFiber(user, name, brand ?? "", type, color ?? "", yardage);
    return created;
  }

  @Router.get("/fibers")
  async getFibers(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const fibers = await Inventorying.getUserInventory(user);
    return fibers;
  }

  @Router.patch("/fibers/:id")
  async editFiber(session: SessionDoc, id: string, name?: string, brand?: string, type?: string, color?: string, yardage?: number) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Inventorying.assertOwnerIsUser(oid, user);
    return await Inventorying.editFiber(oid, name, brand, type, color, yardage);
  }

  @Router.delete("/fibers/:id")
  async deleteFiber(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Inventorying.assertOwnerIsUser(oid, user);
    return await Inventorying.deleteFiber(oid);
  }

  // PROJECT MANAGING CONCEPT
  @Router.post("/projects")
  async createProject(session: SessionDoc, title: string, status: string) {
    const user = Sessioning.getUser(session);
    return ProjectManaging.createProject(user, title, status);
  }

  @Router.patch("/projects/:id")
  async editProject(session: SessionDoc, id: string, title: string, status: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.editProject(user, oid, title, status);
  }

  @Router.post("/projects/:id/fibers")
  async addNewFiberToProject(session: SessionDoc, id: string, name: string, yardage: number, brand?: string, type?: string, color?: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    const created = await ProjectInventorying.addNewFiber(oid, name, brand ?? "", type ?? "", color ?? "", yardage);
    if (created.fiber !== null) {
      return await ProjectManaging.addFiber(user, oid, created.fiber._id);
    } else {
      return created.msg;
    }
  }

  @Router.post("/projects/:id/fibers/:fiber_id")
  async addFiberToProjectFromInventory(session: SessionDoc, id: string, fiber_id: string, yardage?: number) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    const fid = new ObjectId(fiber_id);
    const used_fiber = (await Inventorying.idsToFibers([fid]))[0];
    if (used_fiber) {
      const created = await ProjectInventorying.addNewFiber(oid, used_fiber.name, used_fiber.brand, used_fiber.type, used_fiber.color, yardage ?? used_fiber.remainingYardage);
      if (created.fiber !== null) {
        await ProjectManaging.addFiber(user, oid, created.fiber._id);
        if (yardage) {
          return await Inventorying.editFiber(fid, undefined, undefined, undefined, undefined, used_fiber.remainingYardage - yardage);
        }
        return await Inventorying.deleteFiber(fid);
      } else {
        return created.msg;
      }
    }
    throw new NotAllowedError("You don't own this fiber object!");
  }

  // consider as used or just renaming, so does not get added back to the inventory
  @Router.patch("/projects/:id/fibers/:fiber_id")
  async editFiberInProject(session: SessionDoc, id: string, fiber_id: string, name?: string, brand?: string, type?: string, color?: string, yardage?: number) {
    const user = Sessioning.getUser(session); // the user is considered the owner of the project
    const oid = new ObjectId(id); // the project is considered the owner of the inventory
    const fid = new ObjectId(fiber_id);
    await ProjectManaging.assertOwnerIsUser(user, oid);
    await ProjectInventorying.assertOwnerIsUser(fid, oid);
    return ProjectInventorying.editFiber(fid, name, brand, type, color, yardage);
  }

  @Router.delete("/projects/:id/fibers/:fiber_id")
  async deleteFiberInProject(session: SessionDoc, id: string, fiber_id: string) {
    const user = Sessioning.getUser(session); // the user is considered the owner of the project
    const oid = new ObjectId(id); // the project is considered the owner of the inventory
    const fid = new ObjectId(fiber_id);
    console.log(fid);
    await ProjectManaging.assertOwnerIsUser(user, oid);
    await ProjectInventorying.assertOwnerIsUser(fid, oid);
    // update total inventory to contain add back the fiber
    const fiber = await ProjectInventorying.idsToFibers([fid]);
    await Inventorying.updateCorrespondingFibers(user, fiber);
    await ProjectInventorying.deleteFiber(fid);
    return await ProjectManaging.deleteFiber(user, oid, fid);
  }

  @Router.patch("/projects/:id/notes")
  async editNotes(session: SessionDoc, id: string, notes: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.editNotes(user, oid, notes);
  }

  @Router.post("/projects/:id/link")
  async addLink(session: SessionDoc, id: string, link: string) {
    if (!URL.canParse(link)) {
      throw new NotAllowedError(`expected VALID link but got ${link}`);
    }
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.addLink(user, oid, link);
  }

  @Router.delete("/projects/:id/link")
  async deleteLink(session: SessionDoc, id: string, link: string) {
    if (!URL.canParse(link)) {
      throw new NotAllowedError(`expected VALID link but got ${link}`);
    }
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.deleteLink(user, oid, link);
  }

  @Router.post("/projects/:id/image")
  async addImage(session: SessionDoc, id: string, image: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.addImage(user, oid, image);
  }

  @Router.delete("/projects/:id/image")
  async deleteImage(session: SessionDoc, id: string, image: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.deleteImage(user, oid, image);
  }

  @Router.get("/projects")
  async getProjects(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const projects = await ProjectManaging.getProjects(user);
    return Responses.projects(projects.projects);
  }

  @Router.delete("/projects/:id")
  async deleteProject(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    const fiber_ids = await ProjectManaging.getFibers(user, oid);
    const fibers: (FiberDoc | null)[] = await ProjectInventorying.idsToFibers(fiber_ids.fibers);
    // this will find the fibers assigned to the project and add them back to the user's general inventory
    await Inventorying.updateCorrespondingFibers(user, fibers);
    // now delete the materials from project's inventory
    await Promise.all(fiber_ids.fibers.map((fiber_id: ObjectId) => ProjectInventorying.deleteFiber(fiber_id)));
    return await ProjectManaging.deleteProject(user, oid);
  }

  @Router.post("/guides/:id")
  async importGuide(session: SessionDoc, id: string, title: string, guide_link: string, selected_fibers: string, selected_amounts: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    // TODO: get guide name from posting
    const project = await ProjectManaging.createProject(user, title, "To Do");
    if (project.project) {
      if (!URL.canParse(guide_link)) {
        throw new NotAllowedError(`expected VALID link but got ${guide_link}`);
      }
      await ProjectManaging.addLink(user, project.project._id, guide_link);
    } else {
      throw new Error("failed creating new project");
    }
    const fibers: ObjectId[] = selected_fibers.split(",").map((fiber_id: string) => new ObjectId(fiber_id));
    // get amounts from the guide
    const amounts: number[] = selected_amounts.split(",").map((amount: string) => parseFloat(amount));
    await Promise.all(fibers.map((fiber: ObjectId, idx: number) => Inventorying.editFiber(fiber, undefined, undefined, undefined, undefined, amounts[idx])));
    return Responses.project(project.project);
  }

  // FRIENDS CONCEPT

  //   @Router.get("/friends")
  //   async getFriends(session: SessionDoc) {
  //     const user = Sessioning.getUser(session);
  //     return await Authing.idsToUsernames(await Friending.getFriends(user));
  //   }

  //   @Router.delete("/friends/:friend")
  //   async removeFriend(session: SessionDoc, friend: string) {
  //     const user = Sessioning.getUser(session);
  //     const friendOid = (await Authing.getUserByUsername(friend))._id;
  //     return await Friending.removeFriend(user, friendOid);
  //   }

  //   @Router.get("/friend/requests")
  //   async getRequests(session: SessionDoc) {
  //     const user = Sessioning.getUser(session);
  //     return await Responses.friendRequests(await Friending.getRequests(user));
  //   }

  //   @Router.post("/friend/requests/:to")
  //   async sendFriendRequest(session: SessionDoc, to: string) {
  //     const user = Sessioning.getUser(session);
  //     const toOid = (await Authing.getUserByUsername(to))._id;
  //     return await Friending.sendRequest(user, toOid);
  //   }

  //   @Router.delete("/friend/requests/:to")
  //   async removeFriendRequest(session: SessionDoc, to: string) {
  //     const user = Sessioning.getUser(session);
  //     const toOid = (await Authing.getUserByUsername(to))._id;
  //     return await Friending.removeRequest(user, toOid);
  //   }

  //   @Router.put("/friend/accept/:from")
  //   async acceptFriendRequest(session: SessionDoc, from: string) {
  //     const user = Sessioning.getUser(session);
  //     const fromOid = (await Authing.getUserByUsername(from))._id;
  //     return await Friending.acceptRequest(fromOid, user);
  //   }

  //   @Router.put("/friend/reject/:from")
  //   async rejectFriendRequest(session: SessionDoc, from: string) {
  //     const user = Sessioning.getUser(session);
  //     const fromOid = (await Authing.getUserByUsername(from))._id;
  //     return await Friending.rejectRequest(fromOid, user);
  //   }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
