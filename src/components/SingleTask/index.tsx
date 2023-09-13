import { useDraggable } from "@dnd-kit/core";
import { Flex, Text } from "@mantine/core";
import { RouterOutputs } from "~/utils/api";

type TaskWithUser = RouterOutputs["tasks"]["getTasksByColumn"][number];

const SingleTask = ({ task }: { task: TaskWithUser }) => {
  const { content, createdAt, id } = task;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      className=" m-2 max-w-xs rounded border-2 border-solid border-gray-400 p-4"
      style={style}
      {...listeners}
      {...attributes}
    >
      <Text>{content}</Text>
      <Text>{`Created at ${new Intl.DateTimeFormat().format(createdAt)}`}</Text>
      {/* //TO DO: Add a date-formatting library (day.js or date-fns) */}
      <Flex gap="md" align="center">
        {/* <Text>{`Created by ${username}`}</Text> */}
        {/* <Avatar src={author?.profileImageUrl} radius="xl" /> */}
      </Flex>
    </div>
  );
};

export default SingleTask;
