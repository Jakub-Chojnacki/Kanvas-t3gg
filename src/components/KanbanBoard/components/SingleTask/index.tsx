import { Avatar, Flex, Text } from "@mantine/core";
import { Draggable } from "@hello-pangea/dnd";
import { useRouter } from "next/router";

import { RouterOutputs } from "~/utils/api";

type TaskWithUser = RouterOutputs["tasks"]["getTasksByBoard"][number];

interface ISingleTask {
  task: TaskWithUser;
  index: number;
}

const SingleTask: React.FC<ISingleTask> = ({ task, index }) => {
  const { content, id, title, boardId } = task;
  const { push } = useRouter();
  const handleOpenTaskModal = () => push(`/board/${boardId}/task/${id}`);

  return (
    <Draggable draggableId={id} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }) => (
        <div
          onClick={handleOpenTaskModal}
          ref={innerRef}
          {...dragHandleProps}
          {...draggableProps}
          className="flex min-h-[100px] max-w-xs  cursor-grab  flex-col  justify-between rounded-xl bg-zinc-800 px-4 py-2"
        >
          <Text className="w-fit cursor-pointer  text-md font-bold">
            {title}
          </Text>

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
