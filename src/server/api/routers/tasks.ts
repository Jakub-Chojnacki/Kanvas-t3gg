import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

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
  getTasksByColumn: privateProcedure
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: { columnId: input.columnId },
      });

      if (!tasks) throw new TRPCError({ code: "NOT_FOUND" });

      return tasks;
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
        content: z.string().min(1),
        columnId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { content, columnId } }) => {
      const authorId = ctx.userId;

      const newTask = await ctx.prisma.task.create({
        data: {
          authorId,
          content,
          columnId,
        },
      });

      return newTask;
    }),
});
