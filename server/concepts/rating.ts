import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface RatingDoc extends BaseDoc {
  rating: number;
  object: ObjectId;
}

const ECO_FRIENDLY_FIBERS = ["organic hemp", "organic cotton", "organic linen", "lyocell", "econyl", "pinatex", "qmonos", "bamboo"];

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

  static calculateEcoRating(fiber_types: string[][]) {
    const total_fibers = fiber_types.length;
    const eco_friendly_count = fiber_types.filter((fiber_row) => ECO_FRIENDLY_FIBERS.includes(fiber_row[2]?.toLowerCase())).length;
    return total_fibers > 0 ? (eco_friendly_count / total_fibers) * 5 : 0;
  }

  static calculateBeginnerRating(options?: { tips?: string[]; mistakes?: string[] }) {
    const tips_count = options?.tips?.length || 0;
    const mistakes_count = options?.mistakes?.length || 0;
    const max_tips_mistakes = 3;

    return Math.min(((tips_count + mistakes_count) / max_tips_mistakes) * 5, 5);
  }
}
