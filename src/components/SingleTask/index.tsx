import { Text } from "@mantine/core";
import { RouterOutputs } from "~/utils/api";

type TaskWithUser = RouterOutputs["tasks"]["getAll"][number];

const SingleTask = ({ task, author }: TaskWithUser) => {
  const { content, createdAt } = task;

  const username =
    author?.username || `${author?.firstName}  ${author?.lastName}`;

  return (
    <div className=" rounded border-2 border-gray-400 border-solid p-4 max-w-xs">
      <Text>{content}</Text>
      <Text>{`Created at ${new Intl.DateTimeFormat().format(createdAt)}`}</Text>
      <Text>{`Created by ${username}`}</Text>
    </div>
  );
};

export default SingleTask;
