import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface RatingDoc extends BaseDoc {
  rating: number;
  object: ObjectId;
}

/**
 * concept: Rating[Object]
 */
export default class RatingConcept {
  public readonly ratings: DocCollection<RatingDoc>;

  /**
   * Make an instance of Rating.
   */
  constructor(collectionName: string) {
    this.ratings = new DocCollection<RatingDoc>(collectionName);
  }

  async create(object: ObjectId, rating: number) {
    const _id = await this.ratings.createOne({ object, rating });
    return { msg: "Rating successfully created!", post: await this.ratings.readOne({ _id }) };
  }

  async getRatings() {
    // Returns all ratings!
    return await this.ratings.readMany({}, { sort: { _id: -1 } });
  }

  async getObjectsWithMinRating(score: number) {
    return await this.ratings.aggregateMatch([{ $match: { rating: { $gte: score } } }, { $sort: { rating: -1 } }]);
  }

  async update(_id: ObjectId, rating: number) {
    await this.ratings.partialUpdateOne({ _id }, { rating });
    return { msg: "Rating successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.ratings.deleteOne({ _id });
    return { msg: "Rating deleted successfully!" };
  }
}
