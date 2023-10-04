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
  column: RouterOutputs["columns"]["getColumnsByBoardId"][number];
  tasks: RouterOutputs["tasks"]["getTasksByBoard"][number][];
  index: number;
};

const TaskColumn = ({ column, tasks, index }: SingleTaskColumn) => {
  const { id: columnId } = column;
  const [input, setInput] = useState("");

  const ctx = api.useContext();
  const { mutate } = api.tasks.create.useMutation({
    onSuccess: async () => {
      setInput("");
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
          className="flex h-[500px] w-[350px] flex-grow flex-col overflow-y-auto rounded-xl bg-zinc-900 p-4"
          {...draggableProps}
        >
          <div
            className=" mb-4 border-0 border-b-2 border-solid border-gray-100 border-opacity-30 text-xl font-bold"
            {...dragHandleProps}
          >
            {column.name}
          </div>
          <Droppable droppableId={columnId} type={DROPPABLE_TYPE.TASK}>
            {(provided) => (
              // DON'T REMOVE flex-grow; It is necessary for dnd to work
              <div
                className="flex flex-grow flex-col gap-3"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks?.sort(compareOrder)?.map((task, index) => (
                  <SingleTask key={task.id} task={task} index={index} />
                ))}
              </div>
            )}
          </Droppable>
          <div className="mt-auto">
            <button
              onClick={() =>
                mutate({
                  content: "Test content",
                  columnId,
                  boardId: column.boardId,
                  title: input,
                })
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
