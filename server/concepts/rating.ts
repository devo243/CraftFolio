import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface RatingDoc extends BaseDoc {
  rating: number;
  object: ObjectId;
}

const ECO_FRIENDLY_FIBERS = ["hemp", "cotton", "linen", "lyocell", "econyl", "pinatex", "qmonos", "bamboo"];

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
    const _id = await this.ratings.createOne({ object, rating});
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
    const update = await this.ratings.partialUpdateOne({ object: _id }, { rating });
    console.log("update rating to : ", rating, " for: ", _id, "update: ", update);
    return { msg: "Rating successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.ratings.deleteOne({ _id });
    return { msg: "Rating deleted successfully!" };
  }

  static calculateEcoRating(fiber_types: string[]) {
    const total_fibers = fiber_types.length;
    const eco_friendly_count = fiber_types.filter((fiber) => ECO_FRIENDLY_FIBERS.includes(fiber.toLowerCase().trim())).length;
    const rating = total_fibers > 0 ? (eco_friendly_count / total_fibers) * 5 : 0;
    console.log(fiber_types, total_fibers, eco_friendly_count, rating);
    return Math.round(rating);
  }

  static calculateBeginnerRating(options?: { tips?: string[]; mistakes?: string[], links?: string[] }) {
    const tips_count = options?.tips?.length || 0;
    const mistakes_count = options?.mistakes?.length || 0;
    const links_count = options?.links?.length || 0;
    const max_tips_mistakes = 2;
    const rating = Math.min(Math.floor((tips_count + mistakes_count + links_count)), 5);
    console.log(tips_count, mistakes_count, links_count, rating)
    return Math.round(rating);
  }
}
