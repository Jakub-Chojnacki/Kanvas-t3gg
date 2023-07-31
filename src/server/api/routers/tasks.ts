import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany();
  }),
});
