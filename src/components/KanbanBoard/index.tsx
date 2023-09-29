import React, { useMemo, useState, useEffect } from "react";
import TaskColumn from "./components/TaskColumn";
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  Over,
  PointerSensor,
  closestCenter,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { RouterOutputs, api } from "~/utils/api";
import { Column, Task } from "@prisma/client";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import getDndOrder from "~/utils/getDndOrder";
import reorderDndArray from "~/utils/reorderDndArray";
import SingleTask from "./components/SingleTask";
import { SORTABLE_TYPE } from "./const";
import TaskCard from "./components/TaskCard";

type BoardData = NonNullable<RouterOutputs["boards"]["getById"]>;

const KanbanBoard = ({ boardData }: { boardData: BoardData }) => {
  const ctx = api.useContext();

  const [columnsData, setColumnsData] = useState<Column[]>([]);
  const [tasksData, setTasksData] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { data: columns } = api.columns.getById.useQuery({ id: boardData.id });
  const { data: tasks } = api.tasks.getTasksByBoard.useQuery({
    boardId: boardData.id,
  });

  const columnsId = useMemo(
    () => columns?.map((col) => col.id) || [],
    [columns]
  );

  useEffect(() => {
    if (columns?.length && !columnsData.length) setColumnsData(columns);
  }, [columns]);

  useEffect(() => {
    if (tasks?.length && !tasksData.length) setTasksData(tasks);
  }, [tasks]);

  const { mutate: reorderColumns } = api.columns.reorderColumns.useMutation({
    onSuccess: async () => {
      await ctx.columns.getById.invalidate({ id: boardData.id });
    },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
  });

  const { mutate: reorderTasks } = api.tasks.reorderTasks.useMutation({
    onSuccess: async () => {
      await ctx.columns.getById.invalidate({ id: boardData.id });
    },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const resetActiveElements = (): void => {
    setActiveColumn(null);
    setActiveTask(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    const {
      active: {
        data: { current },
      },
    } = event;

    if (current && current.type === SORTABLE_TYPE.COLUMN) {
      setActiveColumn(current.column as Column);
    }

    if (current && current.type === SORTABLE_TYPE.TASK) {
      setActiveTask(current.task as Task);
    }
  };

  const handleReorderColumn = (
    active: Active,
    over: Over,
    activeId: string,
    overId: string
  ): void => {
    const { activeOrder, overOrder } = getDndOrder(
      active,
      over,
      SORTABLE_TYPE.COLUMN
    );

    const reorderedColumns = reorderDndArray({
      data: columnsData,
      activeId,
      overId,
      activeOrder,
      overOrder,
    });

    setColumnsData(reorderedColumns);

    return reorderColumns({
      activeId,
      overId,
      activeOrder,
      overOrder,
    });
  };

  const handleChangeTaskColumn = (
    tasks: Task[],
    taskId: string,
    columnId: string,
    order: number
  ): Task[] => {
    const mappedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, columnId, order } : task
    );

    return mappedTasks;
  };

  console.log(tasksData.map((task) => task.order));

  const handleReorderTask = (
    active: Active,
    over: Over,
    activeId: string,
    overId: string
  ): void => {
    const isOverColumn = over.data.current?.type === SORTABLE_TYPE.COLUMN;
    const activeTask: Task = active?.data?.current?.task;

    if (isOverColumn) {
      const columnLength = tasksData.filter(
        (task) => task.columnId === overId
      ).length;
      const mappedTasks = handleChangeTaskColumn(
        tasksData,
        activeId,
        overId,
        columnLength
      );

      const changedOrderTasks = mappedTasks.map((task) => {
        if (
          task.columnId === activeTask.columnId &&
          task.order > activeTask.order
        ) {
          return { ...task, order: task.order - 1 };
        }
        return task;
      });

      setTasksData(changedOrderTasks);
    }
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (isActiveATask && isOverATask) {
      setTasksData((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex]!.columnId != tasks[overIndex]!.columnId) {
          tasks[activeIndex]!.columnId = tasks[overIndex]!.columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent): void => {
    resetActiveElements();
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (!activeColumn) return;
    if (activeId === overId) return;
    if (activeColumn) handleReorderColumn(active, over, activeId, overId);
    // if (activeTask) handleReorderTask(active, over, activeId, overId);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !active) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;
    const isActiveTask = active.data.current?.type === SORTABLE_TYPE.TASK;
    if (isActiveTask) handleReorderTask(active, over, activeId, overId);
  };

  const compareOrder = (a: Column, b: Column) => {
    return a.order - b.order;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCorners}
    >
      <div className="flex flex-1 flex-row gap-2">
        <SortableContext items={columnsId}>
          {columnsData?.sort(compareOrder)?.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={tasksData.filter((task) => task.columnId === column.id)}
            />
          ))}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <TaskColumn
                column={activeColumn}
                tasks={tasksData.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && <SingleTask task={activeTask} />}
            {/* {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={() => null}
                updateTask={() => null}
              />
            )} */}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
