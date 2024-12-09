import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface CommentOptions {
  type: CommentType;
}

enum CommentType {
  Question,    // 0
  Tip,  // 1
  Comment    // 2
}

export interface CommentDoc extends BaseDoc {
  item: ObjectId;
  author: ObjectId;
  content: string;
  options?: CommentOptions;

}

/**
 * concept: Posting [Item, User]
 */
export default class CommentingConcept {
  public readonly comments: DocCollection<CommentDoc>;

  /**
   * Make an instance of Commetning.
   */
  constructor(collectionName: string) {
    this.comments = new DocCollection<CommentDoc>(collectionName);
  }

  async create(item: ObjectId, author: ObjectId, content: string, options?: CommentOptions) {
    const _id = await this.comments.createOne({ item, author, content, options });
    return { msg: "Comment successfully created on item: " + item, comment: await this.comments.readOne({ _id }) };
  }

  //get all comments on an item
  async getByItem(item: ObjectId) {
    return await this.comments.readMany({ item });
  }

  async getComments() {
    // Returns all comments! You might want to page for better client performance
    return await this.comments.readMany({}, { sort: { _id: -1 } });
  }

  async update(_id: ObjectId, content?: string, options?: CommentOptions) {
    // Note that if content or options is undefined, those fields will *not* be updated
    // since undefined values for partialUpdateOne are ignored.
    await this.comments.partialUpdateOne({ _id }, { content, options });
    return { msg: "Comment successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted successfully!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== user.toString()) {
      throw new CommentAuthorNotMatchError(user, _id);
    }
  }
}

export class CommentAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of Comment {1}!", author, _id);
  }
}
