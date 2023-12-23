import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { IFilteredUser, filterUserData } from "./tasks";

export const commentsRouter = createTRPCRouter({
  getCommentsByTask: privateProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: { taskId: input.taskId },
      });

      const users = await clerkClient.users.getUserList({
        userId: comments.map((comment) => comment.authorId),
      });

      const filteredUsers = users.map(filterUserData);

      const fallbackAuthor = {
        id: `unknown-${Math.random()}`,
        firstName: "Unknown",
        lastName: "User",
        profileImageUrl: "",
        username: null,
      };

      return comments.map((comment) => ({
        ...comment,
        author:
          filteredUsers.find((user) => user.id === comment.authorId) ||
          fallbackAuthor,
      }));
    }),
  create: privateProcedure
    .input(
      z.object({
        content: z.string().min(1),
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { content, taskId } }) => {
      const authorId = ctx.userId;
      const newComment = await ctx.prisma.comment.create({
        data: {
          content,
          taskId,
          authorId,
        },
      });

      return newComment;
    }),

  delete: privateProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { commentId } }) => {
      try {
        const deletedColumn = await ctx.prisma.comment.delete({
          where: {
            id: commentId,
          },
        });

        return deletedColumn;
      } catch (error) {
        console.error("Error deleting a comment:", error);
      }
    }),
  update: privateProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { commentId, content } }) => {
      try {
        const updatedTask = await ctx.prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            content,
          },
        });

        return updatedTask;
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }),
});
