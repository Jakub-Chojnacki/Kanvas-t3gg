import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const boardsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const memberId = ctx.userId;
    const boards = await ctx.prisma.board.findMany({
      take: 10,
      where: { members: memberId },
    });

    return boards;
  }),
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const boards = await ctx.prisma.board.findUnique({
        where: { id: input.id },
      });

      return boards;
    }),
});
