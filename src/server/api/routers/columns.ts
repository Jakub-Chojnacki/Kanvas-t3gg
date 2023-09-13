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

      return column
    }),
});
