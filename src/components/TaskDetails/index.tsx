import { Modal, Grid, Flex, Box } from "@mantine/core";
import { useRouter } from "next/router";
import { RouterOutputs } from "~/utils/api";

import TaskContent from "./components/TaskContent";
import TaskTitle from "./components/TaskTitle";
import RightDetailsColumn from "./components/RightDetailsColumn";

interface ITaskDetails {
  taskId: string;
  boardId: string;
  taskData: RouterOutputs["tasks"]["getById"];
}

const TaskDetails: React.FC<ITaskDetails> = ({ taskData }) => {
  const { content, title } = taskData;

  return (
    <Flex justify="space-between" className="h-[100%]">
      <Flex direction={"column"} className="px-4">
        <TaskTitle editorContent={title} />
        <TaskContent content={content} />
        <Box>Attachments(only if they're added)</Box>
        <Box>AddComment</Box>
        <Box>CommentList</Box>
      </Flex>
      <Box className="h-[100%] w-[300px] border-0 border-l-2 border-solid border-mantineGray-8">
        <RightDetailsColumn taskData={taskData} />
      </Box>
    </Flex>
  );
};

export default TaskDetails;
