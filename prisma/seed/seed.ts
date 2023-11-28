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

    const toDoColumn = await prisma.column.create({
      data: {
        name: "To do",
        boardId: newBoard.id,
        order: 0,
      },
    });

    const doneColumn = await prisma.column.create({
      data: {
        name: "Done",
        boardId: newBoard.id,
        order: 1,
      },
    });

    await prisma.task.create({
      data: {
        authorId: process.env.MOCK_USER_ID!!,
        content: "Lorem ipsum test content",
        order: 0,
        columnId: toDoColumn.id,
        boardId:newBoard.id,
        title:'Test task',
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
