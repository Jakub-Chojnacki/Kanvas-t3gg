import {  Flex, Modal, Text } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { RouterOutputs, api } from "~/utils/api";
import getUserFullName from "~/utils/getUserFullName";
import BasicButton from "../BasicButton";

export interface IInvitationModal {
  opened: boolean;
  data: RouterOutputs["invitations"]["getById"];
}
const InvitationModal: React.FC<IInvitationModal> = ({ opened, data }) => {
  if (!data) return;
  const { id, boardId, boardName, user } = data;
  const { push } = useRouter();
  const { mutate: acceptInvitation } = api.invitations.accept.useMutation({
    onSuccess: () => {
      push(`/board/${boardId}`);
    },
  });

  const handleAcceptInvitation = (): void => {
    acceptInvitation({ id, boardId });
  };

  const handleCloseInvitation = (): void => {
    push("/");
  };
  return (
    <Modal
      centered
      opened={opened}
      onClose={close}
      title={"Invite a new member"}
    >
      <Text className="my-4">{`You were invited to join ${boardName} by ${getUserFullName(
        user
      )}`}</Text>
      <Flex gap={8} justify="end">
        <BasicButton onClick={handleAcceptInvitation}>Accept</BasicButton>
        <BasicButton onClick={handleCloseInvitation} isOutline>
          Go back 
        </BasicButton>
      </Flex>
    </Modal>
  );
};

export default InvitationModal;
