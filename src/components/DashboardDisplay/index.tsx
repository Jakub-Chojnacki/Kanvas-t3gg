import React from "react";

import { useDisclosure } from "@mantine/hooks";

import { Flex, Text, Modal } from "@mantine/core";
import DashboardSingleProject from "../DashboardSingleProject";
import CreateBoardForm from "../CreateBoardForm";
import BasicButton from "../BasicButton";

import { RouterOutputs } from "~/utils/api";

export interface IDashboardDisplay {
  data: RouterOutputs["boards"]["getAll"];
}

const DashboardDisplay: React.FC<IDashboardDisplay> = ({ data }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Flex gap={64} className="my-4 px-[25%]">
      <Flex direction="column">
        <Text weight="bold" className="text-3xl text-logoPurple-100">
          Projects Dashboard
        </Text>
        <Flex direction="column" gap={16}>
          {data.map((board) => (
            <DashboardSingleProject board={board} key={board.id}/>
          ))}
        </Flex>
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="lg"
        title={
          <Text weight="bold" className="text-2xl">
            Create a new board
          </Text>
        }
      >
        <CreateBoardForm />
      </Modal>
      <Flex>
        <BasicButton onClick={open}>Create a board</BasicButton>
      </Flex>
    </Flex>
  );
};

export default DashboardDisplay;
