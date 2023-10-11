import React, { Fragment } from "react";
import toast from "react-hot-toast";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { IconTrash } from "@tabler/icons-react";
import { Text } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { compareOrder } from "../../utils";

import SingleTask from "../SingleTask";
import ConfirmationModal from "~/components/ConfirmationModal";

import { DROPPABLE_TYPE } from "../../const";
import SimpleAddTask from "../SimpleAddTask";

type SingleTaskColumn = {
  column: RouterOutputs["columns"]["getColumnsByBoardId"][number];
  tasks: RouterOutputs["tasks"]["getTasksByBoard"][number][];
  index: number;
};

const TaskColumn: React.FC<SingleTaskColumn> = ({ column, tasks, index }) => {
  const { push } = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { id: columnId, boardId } = column;

  const ctx = api.useContext();

  const { mutate: deleteColumn } = api.columns.deleteColumn.useMutation({
    onSuccess: async () => {
      await ctx.columns.getColumnsByBoardId.invalidate({ id: boardId });
      close();
    },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
  });

  const handleOpenDeleteModal = (): void => {
    open();
  };

  const handleDeleteColumn = (): void => {
    deleteColumn({ columnId });
  };

  const handleOpenCreateTaskModal = (): void => {
    push(`/board/${boardId}/create`);
  };

  return (
    <Fragment>
      <ConfirmationModal
        opened={opened}
        close={close}
        title="Column deletion"
        modalText="Are you sure you want to delete this column? All of your data will be deleted forever, including tasks in this column!"
        onConfirm={handleDeleteColumn}
      />
      <Draggable draggableId={columnId} index={index}>
        {({ innerRef, dragHandleProps, draggableProps }) => (
          <div
            ref={innerRef}
            className="flex  w-[350px] flex-col rounded-xl bg-zinc-900"
            {...draggableProps}
          >
            <div
              className=" mb-4 flex flex-row justify-between border-0 border-b-2 border-solid border-gray-100 border-opacity-30 p-4 align-middle text-xl font-bold"
              {...dragHandleProps}
            >
              <Text>{column.name}</Text>
              <IconTrash
                className="cursor-pointer"
                onClick={handleOpenDeleteModal}
              />
            </div>
            <Droppable droppableId={columnId} type={DROPPABLE_TYPE.TASK}>
              {(provided) => (
                // DON'T REMOVE flex-grow; It is necessary for dnd to work
                <div
                  className="flex h-[400px] flex-grow flex-col gap-3 overflow-y-scroll px-4 py-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-thumb-rounded scrollbar-h-[10px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasks?.sort(compareOrder)?.map((task, index) => (
                    <SingleTask key={task.id} task={task} index={index} />
                  ))}
                </div>
              )}
            </Droppable>
            <SimpleAddTask columnId={columnId} boardId={boardId} />
          </div>
        )}
      </Draggable>
    </Fragment>
  );
};

export default TaskColumn;
