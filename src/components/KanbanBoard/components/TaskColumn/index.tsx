import { useDroppable } from "@dnd-kit/core";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

import type { RouterOutputs } from "~/utils/api";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SingleTask from "../SingleTask";
import { SORTABLE_TYPE } from "../../const";
import { Task } from "@prisma/client";
import TaskCard from "../TaskCard";

type SingleTaskColumn = {
  column: RouterOutputs["columns"]["getById"][number];
  tasks: Task[]
};

const TaskColumn = ({ column, tasks }: SingleTaskColumn) => {
  const { id: columnId } = column;
  // const { data } = api.tasks.getTasksByColumn.useQuery({ columnId });
  const [input, setInput] = useState("");
  const tasksIds = useMemo(() => {
    return tasks?.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnId,
    data: {
      type: SORTABLE_TYPE.COLUMN,
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[500px] w-[350px] flex-col rounded border-2 border-solid border-rose-500 p-4 opacity-60"
      ></div>
    );
  }

  const compareOrder = (a: Task, b: Task) => {
    return a.order - b.order;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-[500px] w-[350px] flex-col rounded border-2 border-solid border-gray-400 p-4 overflow-y-auto"
    >
      <div {...attributes} {...listeners}>
        {column.name}
      </div>
      <SortableContext items={tasksIds}>
        {tasks?.sort(compareOrder)?.map((task) => (
          <SingleTask key={task.id} task={task} />
        ))}
        {/* {tasks?.sort(compareOrder)?.map((task) => (
          <TaskCard key={task.id} task={task} deleteTask={()=>null} updateTask={()=>null} />
        ))} */}


      </SortableContext>
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
  );
};

export default TaskColumn;
