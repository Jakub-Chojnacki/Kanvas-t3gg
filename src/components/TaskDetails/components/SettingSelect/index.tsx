import { Flex, Text } from "@mantine/core";
import React from "react";

export interface ISettingSelectProps {
  text: string;
  children: React.ReactNode;
}

const SettingSelect: React.FC<ISettingSelectProps> = ({ text, children }) => {
  return (
    <Flex align="center" justify="space-between" gap="1em">
      <Text weight='bold'>{text}</Text>
      {children}
    </Flex>
  );
};

export default SettingSelect;
