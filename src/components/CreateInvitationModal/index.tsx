import { Button, Flex, Modal, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

export interface CreateInvitationModal {
  opened: boolean;
  handleClose: () => void;
}
const CreateInvitationModal: React.FC<CreateInvitationModal> = ({
  opened,
  handleClose,
}) => {
  const { query } = useRouter();
  const boardId = query?.id as string;

  const [link, setLink] = useState("");
  const { mutate: createInvitation } = api.invitations.create.useMutation({
    onSuccess: (inv) => {
      const { location } = window;
      const { id } = inv;
      const invitationLink = `${location.origin}/invite/${id}`;
      setLink(invitationLink);
    },
  });

  const handleGenerateLink = (): void => {
    createInvitation({ boardId });
  };

  useEffect(()=>{
    setLink("")
  },[opened])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {}
  };
  
  return (
    <Modal
      centered
      opened={opened}
      onClose={handleClose}
      title={"Invite a new member"}
      size="xl"
    >
      <Flex gap={16}>
        <TextInput readOnly value={link} className="grow" />
        {!link && (
          <Button onClick={handleGenerateLink}>Generate a link!</Button>
        )}
        {link && <Button onClick={handleCopy}>Copy</Button>}
      </Flex>
    </Modal>
  );
};

export default CreateInvitationModal;
