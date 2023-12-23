import React from "react";
import { ActionIcon, Flex, Text } from "@mantine/core";

export interface ISidenavItem {
  icon: React.ReactNode;
  text: string;
  handleClick?: () => void;
}
const SidenavItem: React.FC<ISidenavItem> = ({ icon, text, handleClick }) => {
  return (
    <Flex
      align="center"
      gap="sm"
      onClick={handleClick}
      className="cursor-pointer hover:bg-mantineGray-8"
     
    >
      <ActionIcon size="lg">{icon}</ActionIcon>
      <Text weight="bold" transform="capitalize">
        {text}
      </Text>
    </Flex>
  );
};

export default SidenavItem;
