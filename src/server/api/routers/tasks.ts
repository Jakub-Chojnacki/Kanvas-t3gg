import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserData = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    firstName: user.firstName,
    lastName : user.lastName
  };
};

export const tasksRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.prisma.task.findMany({ take: 100 });

    const users = await clerkClient.users.getUserList({
      userId: tasks.map((task) => task.authorId),
      limit: 100,
    });

    const filteredUsers = users.map(filterUserData);

    return tasks.map((task) => ({
      task,
      author: filteredUsers.find((user) => user.id === task.authorId),
    }));
  }),
});
