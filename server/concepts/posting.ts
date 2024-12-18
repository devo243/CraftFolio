import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

// the fibers are an array of arrays of fibers from "guide" inventory. the first fiber in each array is the recommended fiber, the rest are its alternatives
// the ids are from the inventorying
export interface PostOptions extends PostHelpOptions {
  fibers?: ObjectId[][];
}
export interface PostHelpOptions {
  tips?: string[];
  mistakes?: string[];
  links?: string[];
}

export interface PostDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  content: string;
  options?: PostOptions;
}

/**
 * concept: Posting [Author, Fiber]
 */
export default class PostingConcept {
  public readonly posts: DocCollection<PostDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.posts = new DocCollection<PostDoc>(collectionName);
  }

  async create(author: ObjectId, title: string, content: string, options?: PostOptions) {
    const _id = await this.posts.createOne({ author, title, content, options });
    return { msg: "Post successfully created!", post: await this.posts.readOne({ _id }) };
  }

  async getPosts() {
    // Returns all posts! You might want to page for better client performance
    return await this.posts.readMany({}, { sort: { _id: -1 } });
  }

  async getFibersForPost(_id: ObjectId) {
    console.log("get: ", _id, typeof _id);
    return (await this.posts.readOne({ _id }))?.options?.fibers;
  }

  async getByAuthor(author: ObjectId) {
    return await this.posts.readMany({ author });
  }

  async update(_id: ObjectId, title?: string, content?: string, options?: PostOptions) {
    // Note that if content or options is undefined, those fields will *not* be updated
    // since undefined values for partialUpdateOne are ignored.
    await this.posts.partialUpdateOne({ _id }, { title, content, options });
    return { msg: "Post successfully updated!" };
  }

  async updateFibers(_id: ObjectId, created_id: ObjectId, alternative_to: string) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const existing_fiber = post.options?.fibers;
    let new_fibers: ObjectId[][] | undefined;
    if (!existing_fiber) {
      new_fibers = [[created_id]];
    } else if (alternative_to === "") {
      new_fibers = existing_fiber.concat([[created_id]]);
    } else {
      new_fibers = existing_fiber.map((fibers: ObjectId[]) => (fibers.map((fiber) => fiber.toString()).includes(alternative_to) ? fibers.concat([created_id]) : fibers));
    }
    return await this.posts.partialUpdateOne({ _id }, { options: { fibers: new_fibers, tips: post.options?.tips, mistakes: post.options?.mistakes, links: post.options?.links } });
  }

  async deleteFibers(_id: ObjectId, fiber_id: string) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const existing_fibers = post.options?.fibers;
    const new_fibers: ObjectId[][] = [];
    if (!existing_fibers) {
      throw new NotAllowedError(`Fiber ${fiber_id} does not exist!`);
    }
    for (const fiberSet of existing_fibers) {
      if (fiberSet[0].toString() !== fiber_id) {
        new_fibers.push(fiberSet.filter((existing_fiber: ObjectId) => existing_fiber.toString() !== fiber_id));
      }
    }
    return await this.posts.partialUpdateOne({ _id }, { options: { fibers: new_fibers, tips: post.options?.tips, mistakes: post.options?.mistakes, links: post.options?.links } });
  }

  async delete(_id: ObjectId) {
    await this.posts.deleteOne({ _id });
    return { msg: "Post deleted successfully!" };
  }

  async getRandomGuide() {
    return await this.posts.aggregateRandom(1);
  }

  async getById(_id: ObjectId) {
    return await this.posts.readOne({ _id });
  }

  async getLinks(_id: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    return post.options?.links || [];
  }

  async addLink(_id: ObjectId, newLink: string) {
    if (!URL.canParse(newLink)) {
      throw new NotAllowedError("Please submit a valid URL!");
    }
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedLinks = [...(post.options?.links || []), newLink];
    await this.update(_id, undefined, undefined, { ...post.options, links: updatedLinks });
    console.log(updatedLinks);
    return { msg: "Link added successfully!", links: updatedLinks };
  }

  async deleteLink(_id: ObjectId, linkToDelete: string) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedLinks = post.options?.links?.filter((link) => link !== linkToDelete) || [];
    await this.update(_id, undefined, undefined, { ...post.options, links: updatedLinks });
    return { msg: "Link deleted successfully!", tips: updatedLinks };
  }

  async editLink(_id: ObjectId, oldLink: string, newLink: string) {
    if (!URL.canParse(newLink)) {
      throw new NotAllowedError("Please submit a valid URL!");
    }
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedLinks = post.options?.links?.map((link) => (link === oldLink ? newLink : link)) || [];
    await this.update(_id, undefined, undefined, { ...post.options, links: updatedLinks });
    return { msg: "Link updated successfully!", links: updatedLinks };
  }

  async getTips(_id: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    return post.options?.tips || [];
  }

  async addTip(_id: ObjectId, newTip: string) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedTips = [...(post.options?.tips || []), newTip];
    await this.update(_id, undefined, undefined, { ...post.options, tips: updatedTips });
    return { msg: "Tip added successfully!", tips: updatedTips };
  }

  async deleteTip(_id: ObjectId, tipToDelete: string) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedTips = post.options?.tips?.filter((tip) => tip !== tipToDelete) || [];
    await this.update(_id, undefined, undefined, { ...post.options, tips: updatedTips });
    return { msg: "Tip deleted successfully!", tips: updatedTips };
  }

  async editTip(_id: ObjectId, oldTip: string, newTip: string) {
    if (newTip.length === 0) {
      throw new NotAllowedError("New tip must be non-empty!");
    }
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedTips = post.options?.tips?.map((tip) => (tip === oldTip ? newTip : tip)) || [];
    await this.update(_id, undefined, undefined, { ...post.options, tips: updatedTips });
    return { msg: "Tip updated successfully!", tips: updatedTips };
  }

  async getMistakes(_id: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    return post.options?.mistakes || [];
  }

  async addMistake(_id: ObjectId, newMistake: string) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedMistakes = [...(post.options?.mistakes || []), newMistake];
    await this.update(_id, undefined, undefined, { ...post.options, mistakes: updatedMistakes });
    return { msg: "Mistake added successfully!", mistakes: updatedMistakes };
  }

  async deleteMistake(_id: ObjectId, mistakeToDelete: string) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedMistakes = post.options?.mistakes?.filter((mistake) => mistake !== mistakeToDelete) || [];
    await this.update(_id, undefined, undefined, { ...post.options, mistakes: updatedMistakes });
    return { msg: "Mistake deleted successfully!", mistakes: updatedMistakes };
  }

  async editMistake(_id: ObjectId, oldMistake: string, newMistake: string) {
    if (newMistake.length === 0) {
      throw new NotAllowedError("New mistake must be non-empty!");
    }
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    const updatedMistakes = post.options?.mistakes?.map((mistake) => (mistake === oldMistake ? newMistake : mistake)) || [];
    await this.update(_id, undefined, undefined, { ...post.options, mistakes: updatedMistakes });
    return { msg: "Mistake updated successfully!", mistakes: updatedMistakes };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
    if (post.author.toString() !== user.toString()) {
      throw new PostAuthorNotMatchError(user, _id);
    }
  }

  async assertPostExists(_id: ObjectId) {
    const post = await this.posts.readOne({ _id });
    if (!post) {
      throw new NotFoundError(`Post ${_id} does not exist!`);
    }
  }
}

export class PostAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}
