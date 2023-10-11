import { Modal } from "@mantine/core";
import CreateTaskForm from "./components/CreateTaskForm";
import { useRouter } from "next/router";

interface ICreateTaskModal {
  boardId: string;
}

const CreateTaskModal: React.FC<ICreateTaskModal> = ({ boardId }) => {
  const { push } = useRouter();

  const handleClose = () => push(`/board/${boardId}`);

  return (
    <Modal centered opened={true} onClose={handleClose} title="Create a task" size={"xl"}>
      <CreateTaskForm boardId={boardId} />
    </Modal>
  );
};

export default CreateTaskModal;
