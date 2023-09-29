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
  getTasksByBoard: privateProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ ctx, input: { boardId } }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: { boardId },
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
        boardId:z.string()
      })
    )
    .mutation(async ({ ctx, input: { content, columnId, boardId } }) => {
      const authorId = ctx.userId;
      const order = await ctx.prisma.task.count();
      const newTask = await ctx.prisma.task.create({
        data: {
          authorId,
          content,
          columnId,
          order,
          boardId
        },
      });

      return newTask;
    }),
  reorderTasks: privateProcedure
    .input(
      z.object({
        activeId: z.string().min(1),
        overId: z.string().min(1),
        activeOrder: z.number(),
        overOrder: z.number(),
        activeChangedColumn: z.string().optional(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: {
          activeId,
          overId,
          activeOrder,
          overOrder,
          activeChangedColumn,
        },
      }) => {
        await ctx.prisma.task.update({
          where: { id: activeId },
          data: {
            order: overOrder,
            columnId: activeChangedColumn,
          },
        });

        await ctx.prisma.task.update({
          where: { id: overId },
          data: {
            order: activeOrder,
          },
        });
      }
    ),
});
