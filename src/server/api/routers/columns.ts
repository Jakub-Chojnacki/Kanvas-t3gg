import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const columnsRouter = createTRPCRouter({
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const column = await ctx.prisma.column.findMany({
        where: { boardId: input.id },
      });

      if (!column) throw new TRPCError({ code: "NOT_FOUND" });

      return column;
    }),
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
        boardId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { name, boardId } }) => {
      const newColumn = await ctx.prisma.column.create({
        data: {
          name,
          boardId,
        },
      });

      return newColumn;
    }),
});
