import { Column, Task } from "@prisma/client";

export const compareOrder = (a: Column | Task, b: Column | Task) => {
  return a.order - b.order;
};
