import React, { useState } from "react";
import TaskColumn from "../TaskColumn";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { RouterOutputs, api } from "~/utils/api";

type boardData = NonNullable<RouterOutputs["boards"]["getById"]>;

const KanbanBoard = ({ boardData }: { boardData: boardData }) => {
  const [parent, setParent] = useState(null);

  const { data: columns } = api.columns.getById.useQuery({ id: boardData.id });

  function handleDragEnd(event: any) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-1 flex-row gap-2">
        <SortableContext items={[]}>
          {columns?.map((column) => (
            <TaskColumn key={column.id} column={column} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
