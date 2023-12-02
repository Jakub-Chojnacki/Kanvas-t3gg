import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Column } from "@prisma/client";
import toast from "react-hot-toast";

import { RouterOutputs, api } from "~/utils/api";
import { compareOrder } from "./utils";

import TaskColumn from "./components/TaskColumn";

import { DROPPABLE_TYPE } from "./const";
import { Box, useMantineTheme } from "@mantine/core";

type BoardData = NonNullable<RouterOutputs["boards"]["getById"]>;

type ReorderSourceDestination = {
  source: DraggableLocation;
  destination: DraggableLocation;
  draggableId?: string;
};

interface IKanbanBoard {
  boardData: BoardData;
}

const KanbanBoard: React.FC<IKanbanBoard> = ({ boardData }) => {
  const ctx = api.useContext();
  const boardId = boardData.id;

  const [columnsData, setColumnsData] = useState<Column[]>([]);
  const [tasksData, setTasksData] = useState<
    RouterOutputs["tasks"]["getTasksByBoard"][number][]
  >([]);

  const { data: columns } = api.columns.getColumnsByBoardId.useQuery({
    id: boardId,
  });
  const { data: tasks } = api.tasks.getTasksByBoard.useQuery({
    boardId,
  });

  useEffect(() => {
    if (columns?.length && !columnsData.length) {
      const clonedColumns = [...columns];
      clonedColumns.sort(compareOrder);
      setColumnsData(clonedColumns);
    }
  }, [columns]);

  useEffect(() => {
    if (tasks?.length && !tasksData.length) {
      const clonedTasks = [...tasks];
      clonedTasks.sort(compareOrder);
      setTasksData(tasks);
    }
  }, [tasks]);

  const { mutate: reorderColumns } = api.columns.reorderColumns.useMutation({
    onSuccess: async () => {
      await ctx.columns.getColumnsByBoardId.invalidate({ id: boardData.id });
    },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
  });

  const { mutate: reorderTasks } = api.tasks.reorderTasks.useMutation({
    onMutate: async ({ reorderedTasks }) => {
      const previousTodos = ctx.tasks.getTasksByBoard.getData({ boardId });

      ctx.tasks.getTasksByBoard.setData({ boardId }, reorderedTasks);

      await ctx.columns.getColumnsByBoardId.invalidate({ id: boardData.id });
    },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
  });

  const onDragEnd = (result: DropResult): void => {
    const { destination, source, type, draggableId } = result;

    if (!destination) return;

    if (type === DROPPABLE_TYPE.COLUMN) {
      handleReorderColumn({ source, destination });
      return;
    }

    if (type === DROPPABLE_TYPE.TASK) {
      const isSameColumn = destination.droppableId === source.droppableId;

      if (isSameColumn && destination.index === source.index) return;

      if (!isSameColumn)
        handleChangeTaskColumn({ source, destination, draggableId });

      if (isSameColumn) handleReorderTask({ source, destination, draggableId });

      return;
    }
  };

  const handleReorderColumn = ({
    source,
    destination,
  }: ReorderSourceDestination): void => {
    const copiedColumns = [...columnsData];
    const [movedColumn] = copiedColumns.splice(source.index, 1);

    if (!movedColumn) return;
    copiedColumns.splice(destination.index, 0, movedColumn);
    const reorderedColumns = copiedColumns.map((column, index) => ({
      ...column,
      order: index,
    }));

    setColumnsData(reorderedColumns);
    reorderColumns({ reorderedColumns });
  };

  const handleChangeTaskColumn = ({
    source,
    destination,
    draggableId,
  }: ReorderSourceDestination): void => {
    const sourceColumnTasks = tasksData.filter(
      (task) => task.columnId === source.droppableId
    );

    const destinationColumnTasks = tasksData.filter(
      (task) => task.columnId === destination.droppableId
    );

    // It should be sorted correctly but it's just a precaution
    sourceColumnTasks.sort(compareOrder);
    destinationColumnTasks.sort(compareOrder);

    const sourceTask = sourceColumnTasks.find(
      (task) => task.id === draggableId
    );
    if (!sourceTask) return;

    const updatedSourceTask = {
      ...sourceTask,
      columnId: destination.droppableId,
    };

    const sourceTaskIndex = sourceColumnTasks.findIndex(
      (task) => task.id === draggableId
    );

    sourceColumnTasks.splice(sourceTaskIndex, 1);
    destinationColumnTasks.splice(destination.index, 0, updatedSourceTask);
    const destinationNewOrder = destinationColumnTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    const reorderedTasks = [
      ...tasksData.filter(
        (task) =>
          task.columnId !== destination.droppableId &&
          task.columnId !== source.droppableId
      ),
      ...destinationNewOrder,
      ...sourceColumnTasks,
    ];

    setTasksData(reorderedTasks);
    reorderTasks({ reorderedTasks });
  };

  const handleReorderTask = ({
    source,
    destination,
  }: ReorderSourceDestination): void => {
    const destinationColumnTasks = tasksData.filter(
      (task) => task.columnId === destination.droppableId
    );

    destinationColumnTasks.sort(compareOrder);

    const [movedTask] = destinationColumnTasks.splice(source.index, 1);
    if (!movedTask) return;
    destinationColumnTasks.splice(destination.index, 0, movedTask);

    // Update the "order" property of each column based on the new order
    const updatedTasks = destinationColumnTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    const reorderedTasks = [
      ...tasksData.filter((task) => task.columnId !== destination.droppableId),
      ...updatedTasks,
    ];

    reorderTasks({ reorderedTasks });
  };

  return (
    <Box
      className="flex h-[100%] flex-row gap-2"
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type={DROPPABLE_TYPE.COLUMN}
          isDropDisabled={false}
        >
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-row gap-4 "
            >
              {columnsData?.sort(compareOrder)?.map((column, index) => (
                <TaskColumn
                  key={column.id}
                  column={column}
                  index={index}
                  tasks={
                    tasks?.filter((task) => task.columnId === column.id) || []
                  }
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
