import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

import { compareOrder } from "~/components/KanbanBoard/utils";

export const columnsRouter = createTRPCRouter({
  getColumnsByBoardId: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const columns = await ctx.prisma.column.findMany({
        where: { boardId: input.id },
      });

      if (!columns) throw new TRPCError({ code: "NOT_FOUND" });

      columns.sort(compareOrder);

      return columns;
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
  deleteColumn: privateProcedure
    .input(
      z.object({
        columnId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { columnId } }) => {
      try {
        const deletedTasks = await ctx.prisma.task.deleteMany({
          where: {
            columnId,
          },
        });

        const deletedColumn = await ctx.prisma.column.delete({
          where: {
            id: columnId,
          },
        });

        return { deletedTasks, deletedColumn };
      } catch (error) {
        console.error("Error deleting column:", error);
      }
    }),
});
