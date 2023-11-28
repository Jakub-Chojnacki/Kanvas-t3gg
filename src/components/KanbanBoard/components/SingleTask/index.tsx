import { Avatar, Box, Flex, Text, useMantineTheme } from "@mantine/core";
import { Draggable } from "@hello-pangea/dnd";
import { useRouter } from "next/router";

import { RouterOutputs } from "~/utils/api";

type TaskWithUser = RouterOutputs["tasks"]["getTasksByBoard"][number];

interface ISingleTask {
  task: TaskWithUser;
  index: number;
}

const SingleTask: React.FC<ISingleTask> = ({ task, index }) => {
  const { id, title, boardId } = task;
  const theme = useMantineTheme();
  const { push } = useRouter();
  const handleOpenTaskModal = () => push(`/board/${boardId}/task/${id}`);

  return (
    <Draggable draggableId={id} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }) => (
        <Box
          onClick={handleOpenTaskModal}
          ref={innerRef}
          {...dragHandleProps}
          {...draggableProps}
          bg={theme.colorScheme === "dark" ? theme.colors.gray[9] : "white"}
          className="flex min-h-[100px] max-w-xs  cursor-grab  flex-col  justify-between rounded-xl px-4 py-2"
        >
          <Text className="text-md w-fit  cursor-pointer font-bold">
            {title}
          </Text>

          <Flex gap="md" align="center">
            {task.author && (
              <Avatar src={task.author.profileImageUrl} radius="xl" size="sm" />
            )}
          </Flex>
        </Box>
      )}
    </Draggable>
  );
};

export default SingleTask;
