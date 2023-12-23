import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
} from "~/server/api/trpc";

export const invitationsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        boardId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { boardId } }) => {
      const createdBy = ctx.userId;
      const invitation = await ctx.prisma.boardInvitation.create({
        data: {
          boardId,
          createdBy,
        },
      });

      return invitation;
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        const deletedColumn = await ctx.prisma.boardInvitation.delete({
          where: {
            id,
          },
        });

        return deletedColumn;
      } catch (error) {
        console.error("Error deleting the invitation:", error);
      }
    }),
  accept: privateProcedure
    .input(
      z.object({
        id: z.string(),
        boardId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id, boardId } }) => {
      try {
        const userId = ctx.userId;
        const acceptedInvitation = await ctx.prisma.boardInvitation.update({
          where: {
            id,
          },
          data: {
            expired: true,
          },
        });

        await ctx.prisma.boardMember.create({
          data: {
            userId,
            boardId,
          },
        });

        return acceptedInvitation;
      } catch (error) {
        console.error("Error accepting the invitation:", error);
      }
    }),
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const invitation = await ctx.prisma.boardInvitation.findUnique({
        where: { id: input.id },
      });

      if (!invitation)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "An invitation with this id does not exist!",
        });

      const existingMember = await ctx.prisma.boardMember.findFirst({
        where: {
          userId,
          boardId: invitation.boardId,
        },
      });

      if (existingMember)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already a member of this board!",
        });
      const boardData = await ctx.prisma.board.findUnique({
        where: { id: invitation?.boardId },
      });

      const userData = await clerkClient.users.getUser(invitation?.createdBy);

      return {
        ...invitation,
        boardName: boardData?.name,
        user: userData,
      };
    }),
});
