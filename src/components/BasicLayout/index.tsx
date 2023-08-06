import { Flex, useMantineTheme } from "@mantine/core";
import React, { ReactNode } from "react";
import AppHeader from "../AppHeader";
import { headerHeight } from "../AppHeader";

interface IBasicLayoutProps {
  children?: ReactNode;
}

const BasicLayout = ({ children }: IBasicLayoutProps) => {
  const theme = useMantineTheme();

  return (
    <Flex w="100%" mih="100vh" direction="column">
      <AppHeader />
      <Flex
        bg={theme.colorScheme === "dark" ? "dark.6" : "white"}
        w="100%"
        h={`calc(100vh - ${headerHeight}px)`}
        align="center"
        justify="center"
      >
        {children}
      </Flex>
    </Flex>
  );
};

export default BasicLayout;
