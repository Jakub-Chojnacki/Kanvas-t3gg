import React, { useState } from "react";
import { useRouter } from "next/router";
import { Flex, Text } from "@mantine/core";
import {
  IconTable,
  IconNotebook,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import SidenavItem from "./SidenavItem";
import CreateInvitationModal from "../CreateInvitationModal";

export interface IBoardSidenav {
  boardId: string;
  name: string;
}
const BoardSidenav: React.FC<IBoardSidenav> = ({ boardId, name }) => {
  const { push } = useRouter();
  const handleNavigateToBoard = (): void => {
    push(`/board/${boardId}`);
  };
  const [showInvitatonModal,setShowInvitationModal] = useState(false)

  const openInvitationModal = ():void => {
    setShowInvitationModal(true)
  }
  const closeInvitationModal = ():void => setShowInvitationModal(false)

  return (
    <Flex direction="column" h="100%">
     <CreateInvitationModal  opened={showInvitatonModal} handleClose={closeInvitationModal}/>
      <Text size="2xl" weight="bold">
        {name}
      </Text>
      <Flex direction="column" justify="center" gap={8} mt="1rem">
        <SidenavItem
          icon={<IconTable />}
          text="board"
          handleClick={handleNavigateToBoard}
        />
        <SidenavItem icon={<IconNotebook />} text="notes" />
      </Flex>
      <Flex direction="column" justify="center" gap={8} mt="auto">
        <SidenavItem icon={<IconUsers />} text="team" />
        <SidenavItem icon={<IconUserPlus />} text="invite" handleClick={openInvitationModal}/>
      </Flex>
    </Flex>
  );
};

export default BoardSidenav;
