import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, CommentOnPost, Inventorying, Posting, ProjectInventorying, ProjectManaging, Sessioning } from "./app";
import { PostOptions } from "./concepts/posting";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";
import { CommentOptions } from "./concepts/commenting";
import { NotAllowedError } from "./concepts/errors";
import { FiberDoc } from "./concepts/inventorying";

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

  @Router.post("/posts")
  async createPost(session: SessionDoc, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, content?: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return await Posting.update(oid, content, options);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    return Posting.delete(oid);
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
  async createCommentOnPost(session: SessionDoc, pid: string, content: string, options?: PostOptions) {
    const user = Sessioning.getUser(session);
    const itemID = new ObjectId(pid);
    await Posting.assertPostExists(itemID); //check if that post exists!
    const created = await CommentOnPost.create(itemID, user, content, options);
    return { msg: created.msg, comment: await Responses.comment(created.comment) };
  }

  // POST CONCEPT
  // sync postGuide(user: User, content: String, fibers: set (set Fiber), tips: set String, mistakes: set String, out guide: Guide, out rating: Rating)
  // Posting.postGuide(content, fibers, tips, mistakes, user)
  // Rating.giveRating(guide, someScore)

  // sync editGuide(guide: Guide, ?content, ?fibers, ?tips, ?mistakes)
  // Posting.editGuide(guide, content, fibers, tips, mistakes)
  // Rating.updateRating(guide, newScore)

  // sync importGuide(user: User, guide: Guide, out project: Project)
  // title = title of the guide
  // ProjectManaging.createProject(title, “To Do”)
  // guideLink = link of the guide
  // ProjectManaging.editLinks(project, guideLink)
  // for fiber in guide.fibers:
  //   Inventorying.editFiberCount(fiber, amount)

  // sync getTopGuides(minScore: float, out guides: set Guide)
  // Rating.getObjectsWithMinRating(minScore, ratings)
  // for rating in ratings:
  //   guides |= rating.object

  // INVENTORY CONCEPT
  @Router.post("/fibers")
  async createFiber(session: SessionDoc, name: string, yardage: number, brand?: string, type?: string, color?: string, image?: string) {
    const user = Sessioning.getUser(session);
    const created = await Inventorying.addNewFiber(user, name, brand ?? "", type ?? "", color ?? "", yardage);
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
    // TODO
    await Inventorying.assertOwnerIsUser(oid, user);
    return await Inventorying.editFiber(oid, name, brand, type, color, yardage);
  }

  @Router.delete("fibers/:id")
  async deleteFiber(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    // TODO
    await Inventorying.assertOwnerIsUser(oid, user);
    return await Inventorying.deleteFiber(oid);
  }

  // PROJECT MANAGING CONCEPT
  @Router.post("/projects")
  async createProject(session: SessionDoc, title: string, status: string) {
    const user = Sessioning.getUser(session);
    return ProjectManaging.createProject(user, title, status);
  }

  // @Router.patch("/projects/:id")
  // async editProject(session: SessionDoc, id: string, title?: string, status?: string, fiber_id?: string, yardage?: string, notes?: string, links?: string, add_image?: string, remove_image?:string) {
  //   const user = Sessioning.getUser(session);
  //   const oid = new ObjectId(id);
  //   // dependes on how implemented
  //   await ProjectManaging.editProject(user, oid, title, status);
  //   if (fiber_id && yardage) {
  //     const fid = new ObjectId(fiber_id);
  //     await Inventorying.editFiber(fid, yardage=yardage);
  //     await ProjectManaging.editFiberUsage(oid, fid);
  //   }
  //   if (notes){
  //     await ProjectManaging.editNotes(user, oid, notes);
  //   }
  //   await ProjectManaging.edit_links(oid, links);
  //   await ProjectManaging.addImage(oid, add_image);
  //   await ProjectManaging.deleteImage(oid, remove_image);
  // }

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

  @Router.post("/projects/:id/fibers")
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
          return await Inventorying.editFiber(fid, undefined, undefined, undefined, undefined, yardage);
        }
        return await Inventorying.deleteFiber(fid);
      } else {
        return created.msg;
      }
    }
    throw new NotAllowedError("You don't own this fiber object!");

  }

  // consider as used, so does not get added back to the inventory
  @Router.patch("/projects/:id/fibers/:fid")
  async editFiberInProject(session: SessionDoc, id: string, fiber_id: string, name?: string, brand?: string, type?: string, color?: string, yardage?: number) {
    const user = Sessioning.getUser(session); // the user is considered the owner of the project
    const oid = new ObjectId(id); // the project is considered the owner of the inventory
    const fid = new ObjectId(fiber_id);
    await ProjectManaging.assertOwnerIsUser(user, oid);
    await ProjectInventorying.assertOwnerIsUser(fid, oid);
    return ProjectInventorying.editFiber(fid, name, brand, type, color, yardage);
  }

  @Router.delete("/projects/:id/fibers/:fid")
  async deleteFiberInProject(session: SessionDoc, id: string, fiber_id: string) {
    const user = Sessioning.getUser(session); // the user is considered the owner of the project
    const oid = new ObjectId(id); // the project is considered the owner of the inventory
    const fid = new ObjectId(fiber_id);
    await ProjectManaging.assertOwnerIsUser(user, oid);
    await ProjectInventorying.assertOwnerIsUser(fid, oid);
    await ProjectInventorying.deleteFiber(fid);
    return await ProjectManaging.deleteFiber(user, oid, fid);
  }

  @Router.patch("/projects/:id")
  async editNotes(session: SessionDoc, id: string, notes: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.editNotes(user, oid, notes);
  }

  @Router.post("/projects/:id/:link")
  async addLink(session: SessionDoc, id: string, link: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.addLink(user, oid, link);
  }

  @Router.delete("/projects/:id/:link")
  async deleteLink(session: SessionDoc, id: string, link: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.deleteLink(user, oid, link);
  }

  @Router.post("/projects/:id/:image")
  async addImage(session: SessionDoc, id: string, image: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.addImage(user, oid, image);
  }

  @Router.delete("/projects/:id/:image")
  async deleteImage(session: SessionDoc, id: string, image: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    return await ProjectManaging.deleteLink(user, oid, image);
  }

  @Router.get("/projects")
  async getProjects(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const projects = await ProjectManaging.getProjects(user);
    return Responses.projects(projects.projects);
  }

  // assumes that fibers and counts are strings that have corresponding amounts of each fiber used
  // (both comma-separated)
  // @Router.delete("projects/:id")
  // async deleteProject(session: SessionDoc, id: string, fibers: string, amounts: string) {
  //   const user = Sessioning.getUser(session);
  //   const oid = new ObjectId(id);
  //   await ProjectManaging.deleteProject(user, oid);
  //   const fiber_ids = fibers.split(",");
  //   const fiber_amounts = amounts.split(",");
  //   if (fiber_ids.length !== fiber_amounts.length) throw new Error("Must provide exactly one amount for each fiber");
  //   return await Promise.all(fiber_ids.map((fiber_id: string, idx: number) => Inventorying.editFiber(new ObjectId(fiber_id), fiber_amounts[idx])));
  // }

  @Router.delete("projects/:id")
  async deleteProject(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    const fiber_ids = await ProjectManaging.getFibers(user, oid);
    const fibers: (FiberDoc|null)[] = await ProjectInventorying.idsToFibers(fiber_ids.fibers);
    // this will find the fibers assigned to the project and add them back to the user's general inventory
    if (fibers) {
      const inventory_fibers: (FiberDoc | null)[] = await Promise.all(
        fibers.map(async (fiber: FiberDoc | null) => {
          if (fiber) {
            return (await Inventorying.getFibersWith(fiber.name, fiber.brand, fiber.type, fiber.color))[0];
          }
          return null;
        })
    );
      inventory_fibers.forEach(async (fiber: FiberDoc | null, idx: number) => {
        if (fiber) {
          return await Inventorying.editFiber(fiber._id, undefined, undefined, undefined, undefined, fiber.remainingYardage + (fibers[idx]?.remainingYardage ?? 0));
        }
        const new_fiber = fibers[idx];
        if (new_fiber) {
          return await Inventorying.addNewFiber(user, new_fiber.name, new_fiber.brand, new_fiber.type, new_fiber.color, new_fiber.remainingYardage);
        }
    })
    }
    // now delete the materials from project's inventory
    await Promise.all(fiber_ids.fibers.map((fiber_id: ObjectId) => ProjectInventorying.deleteFiber(fiber_id)));
    return await ProjectManaging.deleteProject(user, oid);
  }

  // WIP
  @Router.post("/guides/:id")
  async importGuide(session: SessionDoc, id: string, guide_link: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    // TODO: get guide name from posting
    const title = "";
    const project = await ProjectManaging.createProject(user, title, "To Do");
    if (project.project) {
      await ProjectManaging.addLink(user, project.project._id, guide_link);
    } else {
      throw new Error("failed creating new project");
    }
    // TODO: get fibers from the guide
    const fibers: ObjectId[] = [];
    // TODO: get amounts from the guide
    const amounts: number[] = [];
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
