import { Flex, Text } from "@mantine/core";
import { Draggable } from "@hello-pangea/dnd";
import { RouterOutputs } from "~/utils/api";

type TaskWithUser = RouterOutputs["tasks"]["getTasksByColumn"][number];

const SingleTask = ({ task, index }: { task: TaskWithUser; index: number }) => {
  const { content, createdAt, id } = task;

  return (
    <Draggable draggableId={id} index={index}>
      {({innerRef,dragHandleProps,draggableProps}) => (
        <div ref={innerRef} {...dragHandleProps} {...draggableProps} className=" m-2 flex h-[100px] min-h-[100px]  max-w-xs cursor-grab items-center rounded-xl border-2  border-solid border-gray-400 bg-slate-700 p-4">
          <Text>{content}</Text>
          <Text>{`Created at ${new Intl.DateTimeFormat().format(
            createdAt
          )}`}</Text>
          {/* //TO DO: Add a date-formatting library (day.js or date-fns) */}
          <Flex gap="md" align="center">
            {/* <Text>{`Created by ${task.authorId}`}</Text> */}
            {/* <Avatar src={author?.profileImageUrl} radius="xl" /> */}
          </Flex>
        </div>
      )}
    </Draggable>
  );
};

export default SingleTask;
