import { Box, Button, Modal, Text } from "@mantine/core";

interface IConfirmationModal {
  opened: boolean;
  close: () => void;
  title: string;
  modalText: string;
  onConfirm: () => void;
}
const ConfirmationModal: React.FC<IConfirmationModal> = ({
  opened,
  close,
  title,
  modalText,
  onConfirm,
}) => {
  return (
    <Modal.Root centered opened={opened} onClose={close} title={title}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header className="border-0 border-b-[1px] border-solid border-t-slate-100 ">
          <Modal.Title className="text-xl font-bold">{title}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body className="mt-6">
          <Text className="text-center">{modalText}</Text>
          <Box className="my-6 flex flex-row justify-around align-middle">
            <Button className="bg-red-600" onClick={onConfirm}>
              Yes, I am sure
            </Button>
            <Button variant="outline" color="gray" onClick={close}>
              No, return
            </Button>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ConfirmationModal;
