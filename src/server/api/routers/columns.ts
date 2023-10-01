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
        reorderedColumns: z.any(),
      })
    )
    .mutation(async ({ ctx, input: { reorderedColumns } }) => {
      try {
        for (let i = 0; i < reorderedColumns.length; i++) {
          const column = reorderedColumns[i];
          const { id, order } = column;

          await ctx.prisma.column.update({
            where: {
              id: id,
            },
            data: {
              order: order,
            },
          });
        }
      } catch (error) {
        console.error("Error updating column order:", error);
      }
    }),
});
