import { Avatar, Flex, Text } from "@mantine/core";
import { Draggable } from "@hello-pangea/dnd";
import { RouterOutputs } from "~/utils/api";
import { Fragment } from "react";

type TaskWithUser = RouterOutputs["tasks"]["getTasksByBoard"][number];

const SingleTask = ({ task, index }: { task: TaskWithUser; index: number }) => {
  const { content, id } = task;

  return (
    <Draggable draggableId={id} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }) => (
        <div
          ref={innerRef}
          {...dragHandleProps}
          {...draggableProps}
          className="flex min-h-[100px] max-w-xs  cursor-grab flex-col  rounded-xl bg-zinc-800 px-4 py-6"
        >
          <Text className="text-lg font-bold">{"Title"}</Text>
          <Text>{content}</Text>

          <Flex gap="md" align="center">
            {task.author && (
              <Avatar src={task.author.profileImageUrl} radius="xl" size="sm" />
            )}
          </Flex>
        </div>
      )}
    </Draggable>
  );
};

export default SingleTask;
