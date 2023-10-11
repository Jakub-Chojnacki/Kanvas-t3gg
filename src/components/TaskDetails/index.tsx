import { Modal, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { RouterOutputs } from "~/utils/api";

interface ITaskDetails {
  taskId: string;
  boardId: string;
  taskData: RouterOutputs["tasks"]["getById"];
}
const TaskDetails: React.FC<ITaskDetails> = ({ taskId, boardId, taskData }) => {
  const { push } = useRouter();

  const handleClose = () => push(`/board/${boardId}`);
  return (
    <Modal centered opened={true} onClose={handleClose}>
      <Text>{taskData.title}</Text>
    </Modal>
  );
};

export default TaskDetails;
