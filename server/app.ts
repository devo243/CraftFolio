import AuthenticatingConcept from "./concepts/authenticating";
import CommentingConcept from "./concepts/commenting";
import FriendingConcept from "./concepts/friending";
import InventoryConcept from "./concepts/inventorying";
import PostingConcept from "./concepts/posting";
import ProjectManagingConcept from "./concepts/projectmanaging";
import RatingConcept from "./concepts/rating";
import SessioningConcept from "./concepts/sessioning";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Inventorying = new InventoryConcept("fibers");
export const CommentOnPost = new CommentingConcept("comments_on_posts");
export const ProjectManaging = new ProjectManagingConcept("projects");
export const ProjectInventorying = new InventoryConcept("project_fibers");
export const EcoFriendlyRating = new RatingConcept("environment_guides");
export const BeginnerFriendlyRating = new RatingConcept("beginner_guides");
