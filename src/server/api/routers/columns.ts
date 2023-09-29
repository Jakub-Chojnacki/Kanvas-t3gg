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
      const order = await ctx.prisma.column.count();
      const newColumn = await ctx.prisma.column.create({
        data: {
          name,
          boardId,
          order,
        },
      });

      return newColumn;
    }),
  reorderColumns: privateProcedure
    .input(
      z.object({
        activeId: z.string().min(1),
        overId: z.string().min(1),
        activeOrder: z.number(),
        overOrder: z.number(),
      })
    )
    .mutation(
      async ({ ctx, input: { activeId, overId, activeOrder, overOrder } }) => {
        await ctx.prisma.column.update({
          where: { id: activeId },
          data: {
            order: overOrder,
          },
        });

        await ctx.prisma.column.update({
          where: { id: overId },
          data: {
            order: activeOrder,
          },
        });
      }
    ),
});
