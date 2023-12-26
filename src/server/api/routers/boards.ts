import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { filterUserData } from "./tasks";

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
      const board = await ctx.prisma.board.findUnique({
        where: { id: input.id },
      });

      return board;
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

      await ctx.prisma.column.create({
        data: {
          name: "To do",
          order: 0,
          boardId: newBoard.id,
        },
      });

      await ctx.prisma.column.create({
        data: {
          name: "In progress",
          order: 1,
          boardId: newBoard.id,
        },
      });

      await ctx.prisma.column.create({
        data: {
          name: "Done",
          order: 2,
          boardId: newBoard.id,
        },
      });

      return newBoard;
    }),
  getBoardMembers: privateProcedure
    .input(
      z.object({ id: z.string(), showCurrentUserFirst: z.boolean().optional() })
    )
    .query(async ({ ctx, input: { id, showCurrentUserFirst } }) => {
      const userId = ctx.userId;
      const members = await ctx.prisma.boardMember.findMany({
        where: {
          boardId: id,
        },
      });

      const users = await clerkClient.users.getUserList({
        userId: members.map((member) => member.userId),
        limit: 100,
      });

      const filteredUsers = users.map(filterUserData);

      if (showCurrentUserFirst) {
        return filteredUsers.sort((firstUser, secondUser) => {
          if (firstUser.id === userId) return -1;
          if (secondUser.id === userId) return 1;
          return 0;
        });
      }

      return filteredUsers;
    }),
  leaveBoard: privateProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(async ({ ctx, input: { boardId } }) => {
      const userId = ctx.userId;
      const userAsBoardMember = await ctx.prisma.boardMember.findFirst({
        where: { userId },
      });
      const deletedUser = await ctx.prisma.boardMember.delete({
        where: {
          id: userAsBoardMember?.id,
          boardId,
        },
      });

      return deletedUser;
    }),
});
