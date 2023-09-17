import { useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import SingleTask from "../SingleTask";
import type { RouterOutputs } from "~/utils/api";

type SingleTaskColumn = {
  column: RouterOutputs["columns"]["getById"][number];
};

const TaskColumn = ({ column }: SingleTaskColumn) => {
  const { id: columnId } = column;
  const { data } = api.tasks.getTasksByColumn.useQuery({ columnId });
  const [input, setInput] = useState("");
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
  });
  const style = {
    color: isOver ? "green" : undefined,
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

  const draggableMarkup = data?.map((task) => (
    <SingleTask key={task.id} task={task} />
  ));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col rounded border-2 border-solid border-gray-400 p-4"
    >
      {draggableMarkup}
      <div className="mt-auto">
        <button onClick={() => mutate({ content: input, columnId })}>
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
