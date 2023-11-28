import { Modal, Grid, Flex, Box } from "@mantine/core";
import { useRouter } from "next/router";
import { RouterOutputs } from "~/utils/api";

import TaskContent from "./components/TaskContent";
import TaskTitle from "./components/TaskTitle";

interface ITaskDetails {
  taskId: string;
  boardId: string;
  taskData: RouterOutputs["tasks"]["getById"];
}
const TaskDetails: React.FC<ITaskDetails> = ({  boardId, taskData }) => {
  const { push } = useRouter();
  const { content, title } = taskData;

  const handleClose = () => push(`/board/${boardId}`);
  return (
    <Modal
      centered
      opened={true}
      onClose={handleClose}
      size={"xl"}
      className="rounded-lg "
      classNames={{
        content: "border-wrapper",
        body: "p-0",
        header: ""
      }}
    >
      <Grid
        align="stretch"
        grow
        classNames={{
          col: "p-0 m-0",
        }}
        className="m-0 "
      >
        <Grid.Col span={8} className="m-0 border-inner border-0 border-t-[1px] border-r-[1px] p-0">
          <Flex direction={"column"} className="p-4">
            <TaskTitle editorContent={title} />
            <TaskContent content={content} />
            <Box>Attachments(only if they're added)</Box>
            <Box>AddComment</Box>
            <Box>CommentList</Box>
          </Flex>
        </Grid.Col>
        <Grid.Col
          span={4}
          className="m-0 border-inner border-0 border-t-[1px] p-0"
        >
          <Flex direction={"column"} className="p-4">
            <Box>Status</Box>
            <Box>Assigned</Box>
            <Box>Created</Box>
            <Box>Attachments</Box>
          </Flex>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default TaskDetails;
