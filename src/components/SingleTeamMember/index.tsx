import React, { useEffect } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { Avatar, Flex, Text } from "@mantine/core";
import ConfirmationModal from "../ConfirmationModal";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";

export interface ISingleTeamMember {
  member: RouterOutputs["boards"]["getBoardMembers"][0];
  index: number;
  boardId: string;
}

const SingleTeamMember: React.FC<ISingleTeamMember> = ({
  member,
  index,
  boardId,
}) => {
  const { profileImageUrl, firstName, lastName } = member;
  const isUser = index === 0;
  const ctx = api.useContext()
  const [opened, { open, close }] = useDisclosure(false);
  const { push } = useRouter();
  const { mutate: leaveBoard } = api.boards.leaveBoard.useMutation({
    onSuccess: async () => {
      ctx.boards.getAll.invalidate()
      push("/");
    },
  });

  const handleLeaveBoard = async (): Promise<void> => {
    leaveBoard({ boardId });
  };

  const handleClickLeaveBoard = (): void => {
    open();
  };

  return (
    <Flex align="center" gap={16}>
      <Avatar src={profileImageUrl} size="lg" />{" "}
      <Text size="lg" weight="bold">{`${firstName} ${lastName}`}</Text>
      {isUser && (
        <Text
          className="cursor-pointer text-red-400"
          onClick={handleClickLeaveBoard}
        >
          Leave this board
        </Text>
      )}
      <ConfirmationModal
        opened={opened}
        close={close}
        title="Leave board"
        modalText="Are you sure you want to leave this board?"
        onConfirm={handleLeaveBoard}
      />
    </Flex>
  );
};

export default SingleTeamMember;
