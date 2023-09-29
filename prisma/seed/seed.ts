// seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Your data seeding logic here
    const newBoard = await prisma.board.create({
      data: {
        name: "First board",
      },
    });

    await prisma.boardMember.create({
      data: {
        userId: process.env.MOCK_USER_ID!!,
        boardId: newBoard.id,
      },
    });

    const newColumn = await prisma.column.create({
      data: {
        name: "To do",
        boardId: newBoard.id,
        order: 0,
      },
    });

    await prisma.task.create({
      data: {
        authorId: process.env.MOCK_USER_ID!!,
        content: "Test task",
        order: 0,
        columnId: newColumn.id,
        boardId:newBoard.id
      },
    });

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
