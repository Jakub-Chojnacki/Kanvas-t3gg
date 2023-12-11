import { Flex, Box } from "@mantine/core";
import { RouterOutputs, api } from "~/utils/api";

import TaskContent from "./components/TaskContent";
import TaskTitle from "./components/TaskTitle";
import RightDetailsColumn from "./components/RightDetailsColumn";
import CommentList from "./components/CommentList";

interface ITaskDetails {
  taskId: string;
  boardId: string;
  taskData: RouterOutputs["tasks"]["getById"];
}

const TaskDetails: React.FC<ITaskDetails> = ({ taskData }) => {
  const { content, title, id, boardId } = taskData;
  const ctx = api.useContext();

  const { mutate: updateTask } = api.tasks.updateTask.useMutation({
    onSuccess: () => {
      ctx.tasks.getTasksByBoard.invalidate({ boardId });
      ctx.tasks.getById.invalidate({ id });
    },
  });

  const handleSaveTitle = (newTitle: string): void => {
    updateTask({ taskId: id, title: newTitle });
  };

  const handleSaveContent  = (newContent: string): void => {
    updateTask({ taskId: id, content: newContent });
  };

  return (
    <Flex justify="space-between" className="h-[100%] ">
      <Flex direction={"column"} className="px-4 w-[100%]">
        <TaskTitle title={title} handleSaveTitle={handleSaveTitle} />
        <TaskContent content={content} handleSaveContent={handleSaveContent}/>
        <CommentList taskId={id}/>
      </Flex>
      <Box className="h-[100%] w-[300px] border-0 border-l-2 border-solid border-mantineGray-8">
        <RightDetailsColumn taskData={taskData} />
      </Box>
    </Flex>
  );
};

export default TaskDetails;
