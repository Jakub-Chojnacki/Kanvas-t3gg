import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

import { compareOrder } from "~/components/KanbanBoard/utils";

const filterUserData = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

export const tasksRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.prisma.task.findMany({ take: 100 });

    const users = await clerkClient.users.getUserList({
      userId: tasks.map((task) => task.authorId),
      limit: 100,
    });

    const filteredUsers = users.map(filterUserData);

    return tasks?.map((task) => ({
      task,
      author: filteredUsers.find((user) => user.id === task.authorId),
    }));
  }),
  getTasksByBoard: privateProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ ctx, input: { boardId } }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: { boardId },
      });

      if (!tasks) throw new TRPCError({ code: "NOT_FOUND" });

      const users = await clerkClient.users.getUserList({
        userId: tasks.map((task) => task.authorId),
        limit: 100,
      });

      const filteredUsers = users.map(filterUserData);

      tasks.sort(compareOrder);

      return tasks.map((task) => ({
        ...task,
        author: filteredUsers.find((user) => user.id === task.authorId),
      }));
    }),
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.id },
      });

      if (!task) throw new TRPCError({ code: "NOT_FOUND" });

      return task;
    }),
  create: privateProcedure
    .input(
      z.object({
        content: z.string(),
        columnId: z.string(),
        boardId: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { content, columnId, boardId, title } }) => {
      const authorId = ctx.userId;
      const order = await ctx.prisma.task.count();
      const newTask = await ctx.prisma.task.create({
        data: {
          authorId,
          content,
          columnId,
          order,
          boardId,
          title,
        },
      });

      return newTask;
    }),
  reorderTasks: privateProcedure
    .input(
      z.object({
        reorderedTasks: z.any(),
        initialColumn: z.any(),
      })
    )
    .mutation(async ({ ctx, input: { reorderedTasks } }) => {
      try {
        // Loop through the reordered columns and update their "order" property in the database
        for (let i = 0; i < reorderedTasks.length; i++) {
          const task = reorderedTasks[i];
          const { id, order, columnId } = task;

          await ctx.prisma.task.update({
            where: {
              id: id,
            },
            data: {
              order: order,
              columnId,
            },
          });
        }

        console.log("Column order updated successfully.");
      } catch (error) {
        console.error("Error updating column order:", error);
      }
    }),
  deleteTask: privateProcedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { taskId } }) => {
      try {
        const deletedTask = await ctx.prisma.task.delete({
          where: {
            id: taskId,
          },
        });

        return deletedTask;
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }),
});
