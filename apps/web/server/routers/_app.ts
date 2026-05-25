import { router } from "../trpc";
import { projectsRouter } from "./projects";
import { postsRouter } from "./posts";
import { contactRouter } from "./contact";
import { mediaRouter } from "./media";

// Compile all modules into a single unified root router
export const appRouter = router({
  projects: projectsRouter,
  posts: postsRouter,
  contact: contactRouter,
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
