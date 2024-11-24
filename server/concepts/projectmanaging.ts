import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface ProjectDoc extends BaseDoc {
  owner: ObjectId;
  title: string;
  status: string;
  dateCreated: Date;
  dateModified: Date;
  notes: string;
  links: string[];
  images: string[];
}

/**
 * concept: ProjectManaging [User, Project]
 */
export default class ProjectManagingConcept {
  public readonly projects: DocCollection<ProjectDoc>;

  constructor(collectionName: string) {
    this.projects = new DocCollection<ProjectDoc>(collectionName);
  }

  // Get the user's projects
  async getProjects(owner: ObjectId) {
    return { projects: await this.projects.readMany({ owner }) };
  }

  // Create a project for the user
  async createProject(owner: ObjectId, title: string, status: string) {
    if (!title || !status) {
      throw new BadValuesError("Project must have a title and status.");
    }
    const date = new Date();
    const _id = await this.projects.createOne({ owner, title, status, dateCreated: date, dateModified: date, notes: "", links: [], images: [] });
    return { msg: "Project created successfully!", project: await this.projects.readOne({ _id }) };
  }

  // Edit a project
  async editProject(owner: ObjectId, _id: ObjectId, title?: string, status?: string) {
    await this.assertOwnerIsUser(owner, _id);
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError("Project not found.");
    }
    const updatedFields: Partial<ProjectDoc> = { title: title || project.title, status: status || project.status, dateModified: new Date() };
    await this.projects.partialUpdateOne({ _id }, updatedFields);
    return { msg: "Project updated successfully!", project: await this.projects.readOne({ _id }) };
  }

  // Delete a project
  async deleteProject(owner: ObjectId, _id: ObjectId) {
    await this.assertOwnerIsUser(owner, _id);
    const result = await this.projects.deleteOne({ _id });
    if (result.deletedCount === 0) {
      throw new NotFoundError("Project not found.");
    }
    return { msg: "Project deleted successfully!" };
  }

  // Get notes for a project
  async getNotes(owner: ObjectId, _id: ObjectId) {
    await this.assertOwnerIsUser(owner, _id);
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError(`Project ${_id} does not exist!`);
    }
    return { notes: project.notes };
  }

  // Edit notes for a project
  async editNotes(owner: ObjectId, _id: ObjectId, notes: string) {
    await this.assertOwnerIsUser(owner, _id);
    await this.projects.partialUpdateOne({ _id }, { notes, dateModified: new Date() });
    return { msg: "Notes updated successfully!", notes };
  }

  // Get links for a project
  async getLinks(owner: ObjectId, _id: ObjectId) {
    await this.assertOwnerIsUser(owner, _id);
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError(`Project ${_id} does not exist!`);
    }
    return { links: project.links };
  }

  // Add a link to a project
  async addLink(owner: ObjectId, _id: ObjectId, newLink: string) {
    await this.assertOwnerIsUser(_id, owner);
    if (typeof newLink !== "string" || !newLink.trim()) {
      throw new BadValuesError("The link must be a non-empty string.");
    }
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError("Project not found.");
    }
    const updatedLinks = Array.from(new Set([...project.links, newLink]));
    await this.projects.partialUpdateOne({ _id }, { links: updatedLinks, dateModified: new Date() });
    return { msg: "Link added successfully!", links: updatedLinks };
  }

  // Delete a link from a project
  async deleteLink(owner: ObjectId, _id: ObjectId, linkToDelete: string) {
    await this.assertOwnerIsUser(_id, owner);
    if (typeof linkToDelete !== "string" || !linkToDelete.trim()) {
      throw new BadValuesError("The link must be a non-empty string.");
    }
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError("Project not found.");
    }
    const updatedLinks = project.links.filter((link) => link !== linkToDelete);
    await this.projects.partialUpdateOne({ _id }, { links: updatedLinks, dateModified: new Date() });
    return { msg: "Link deleted successfully!", links: updatedLinks };
  }

  // Get images for a project
  async getImages(owner: ObjectId, _id: ObjectId) {
    await this.assertOwnerIsUser(owner, _id);
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError(`Project ${_id} does not exist!`);
    }
    return { images: project.images };
  }

  // Add an image to a project
  async addImage(owner: ObjectId, _id: ObjectId, newImage: string) {
    await this.assertOwnerIsUser(_id, owner);
    if (typeof newImage !== "string" || !newImage.trim()) {
      throw new BadValuesError("The image URL must be a non-empty string.");
    }
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError("Project not found.");
    }
    const updatedImages = Array.from(new Set([...project.images, newImage]));
    await this.projects.partialUpdateOne({ _id }, { images: updatedImages, dateModified: new Date() });
    return { msg: "Image added successfully!", images: updatedImages };
  }

  // Delete an image from a project
  async deleteImage(owner: ObjectId, _id: ObjectId, imageToDelete: string) {
    await this.assertOwnerIsUser(_id, owner);
    if (typeof imageToDelete !== "string" || !imageToDelete.trim()) {
      throw new BadValuesError("The image URL must be a non-empty string.");
    }
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError("Project not found.");
    }
    const updatedImages = project.images.filter((image) => image !== imageToDelete);
    await this.projects.partialUpdateOne({ _id }, { images: updatedImages, dateModified: new Date() });
    return { msg: "Image deleted successfully!", images: updatedImages };
  }

  async assertOwnerIsUser(user: ObjectId, _id: ObjectId) {
    const project = await this.projects.readOne({ _id });
    if (!project) {
      throw new NotFoundError(`Project ${_id} does not exist!`);
    }
    if (project.owner.toString() !== user.toString()) {
      throw new PostOwnerNotMatchError(user, _id);
    }
  }
}

export class PostOwnerNotMatchError extends NotAllowedError {
  constructor(
    public readonly owner: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the owner of project {1}!", owner, _id);
  }
}
