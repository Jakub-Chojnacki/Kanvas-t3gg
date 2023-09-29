import { Column } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const boardsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const memberId = ctx.userId;
    const boards = await ctx.prisma.board.findMany({
      take: 10,
      where: {
        members: {
          some: {
            userId: {
              equals: memberId,
            },
          },
        },
      },
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
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input: { name } }) => {
      const authorId = ctx.userId;

      const newBoard = await ctx.prisma.board.create({
        data: {
          name,
        },
      });

      await ctx.prisma.boardMember.create({
        data: {
          userId: authorId,
          boardId: newBoard.id,
        },
      });

      return newBoard;
    }),
});
