import React, { useState } from "react";
import { Task } from "@prisma/client";
import toast from "react-hot-toast";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { compareOrder } from "../../utils";

import SingleTask from "../SingleTask";

import { DROPPABLE_TYPE } from "../../const";

type SingleTaskColumn = {
  column: RouterOutputs["columns"]["getById"][number];
  tasks: Task[];
  index: number;
};

const TaskColumn = ({ column, tasks, index }: SingleTaskColumn) => {
  const { id: columnId } = column;
  const [input, setInput] = useState("");

  const ctx = api.useContext();
  const { mutate } = api.tasks.create.useMutation({
    onSuccess: async () => {
      setInput("");
      await ctx.tasks.getTasksByColumn.invalidate();
    },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
  });

  return (
    <Draggable draggableId={columnId} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }) => (
        <div
          ref={innerRef}
          {...draggableProps}
          className="flex h-[500px] w-[350px] flex-col overflow-y-auto rounded border-2 border-solid border-gray-400 p-4"
        >
          <div {...dragHandleProps}>{column.name}</div>
          <Droppable droppableId={columnId} type={DROPPABLE_TYPE.TASK}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks?.sort(compareOrder)?.map((task, index) => (
                  <SingleTask key={task.id} task={task} index={index} />
                ))}
              </div>
            )}
          </Droppable>
          <div className="mt-auto">
            <button
              onClick={() =>
                mutate({ content: input, columnId, boardId: column.boardId })
              }
            >
              Add a task
            </button>
            <input
              value={input}
              type="text"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskColumn;
