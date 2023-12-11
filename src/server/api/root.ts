import { createTRPCRouter } from "~/server/api/trpc";
import { tasksRouter } from "./routers/tasks";
import { boardsRouter } from "./routers/boards";
import { columnsRouter } from "./routers/columns";
import { commentsRouter } from "./routers/comments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tasks: tasksRouter,
  boards: boardsRouter,
  columns: columnsRouter,
  comments:commentsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
