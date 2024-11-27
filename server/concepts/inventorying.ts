import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface FiberDoc extends BaseDoc {
  user: ObjectId;
  name: string;
  brand: string;
  type: string;
  color: string;
  remainingYardage: number;
}

/**
 * concept: Inventorying [User]
 */
export default class InventoryConcept {
  public readonly fibers: DocCollection<FiberDoc>;

  /**
   * Make an instance of Inventories.
   */
  constructor(collectionName: string) {
    this.fibers = new DocCollection<FiberDoc>(collectionName);
  }

  async getUserInventory(user: ObjectId) {
    return await this.fibers.readMany({ user });
  }

  async addNewFiber(user: ObjectId, name: string, brand: string, type: string, color: string, yardage: number) {
    if (await this.fiberExists(user, name, brand, type, color)) {
      throw new NotAllowedError("This fiber already exists in your inventory!");
    }
    const _id = await this.fibers.createOne({ user, name, brand, type, color, remainingYardage: yardage });
    return { msg: "Fiber successfully added!", fiber: await this.fibers.readOne({ _id }) };
  }

  async deleteFiber(_id: ObjectId) {
    await this.fibers.deleteOne({ _id });
    return { msg: "Fiber deleted successfully!" };
  }

  async editFiber(_id: ObjectId, name?: string, brand?: string, type?: string, color?: string, yardage?: number) {
    //note that if the fields are undefined, the fields will *not* be updated since undefined values
    //for partialUpdateOne are ignored
    await this.fibers.partialUpdateOne({ _id }, { name, brand, type, color, remainingYardage: yardage });
    return { msg: "Fiber successfully updated!" };
  }

  async getFibersWith(name?: string, brand?: string, type?: string, color?: string) {
    return await this.fibers.readMany({ name, brand, type, color });
  }

  async fiberExists(user: ObjectId, name: string, brand: string, type: string, color: string) {
    const fiber = await this.fibers.readOne({ user, name, brand, type, color });
    if (fiber === null) {
      return false;
    }
    return true;
  }

  async idsToFibers(ids: ObjectId[]) {
    const fibers = await this.fibers.readMany({ _id: { $in: ids } });
    const idTofiber = new Map(fibers.map((fiber) => [fiber._id.toString(), fiber]));
    return ids.map((id) => idTofiber.get(id.toString()) ?? null);
  }

  async assertOwnerIsUser(_id: ObjectId, user: ObjectId) {
    const fiber = await this.fibers.readOne({ _id });
    if (fiber?.user !== user) {
      throw new NotAllowedError("You don't own this fiber object!");
    }
  }

  async updateCorrespondingFibers(user: ObjectId, fibers: (FiberDoc | null)[]): Promise<void> {
    const inventory_fibers: (FiberDoc | null)[] = await Promise.all(
        fibers.map(async (fiber: FiberDoc | null) => {
          if (fiber) {
            return (await this.getFibersWith(fiber.name, fiber.brand, fiber.type, fiber.color))[0];
          }
          return null;
        })
    );
    inventory_fibers.forEach(async (fiber: FiberDoc | null, idx: number) => {
      if (fiber) {
        return await this.editFiber(fiber._id, fiber.name, fiber.brand, fiber.type, fiber.color, fiber.remainingYardage + (fibers[idx]?.remainingYardage ?? 0));
      }
      const new_fiber = fibers[idx];
      if (new_fiber) {
        return await this.addNewFiber(user, new_fiber.name, new_fiber.brand, new_fiber.type, new_fiber.color, new_fiber.remainingYardage);
      }
    });
  }
}
