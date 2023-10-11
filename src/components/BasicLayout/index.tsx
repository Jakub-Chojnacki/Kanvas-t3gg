import { Flex, useMantineTheme, Navbar, AppShell } from "@mantine/core";
import React, { ReactNode, useState } from "react";

import AppHeader from "../AppHeader";
import { headerHeight } from "../AppHeader";

interface IBasicLayoutProps {
  children?: ReactNode;
  sideNav?: ReactNode;
}

const BasicLayout = ({ children, sideNav }: IBasicLayoutProps) => {
  const theme = useMantineTheme();
  const [isOpened, setIsOpened] = useState(false);

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
        <AppShell
          styles={{
            main: {
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
              minHeight: `calc(100vh - ${headerHeight}px)`,
            },
            root: {
              maxWidth: "100%",
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={
            sideNav ? (
              <Navbar
                p="md"
                hiddenBreakpoint="sm"
                hidden={!isOpened}
                width={{ sm: 150, lg: 200 }}
              >
                {sideNav}
              </Navbar>
            ) : (
              <React.Fragment></React.Fragment>
            )
          }
        >
          {children}
        </AppShell>
      </Flex>
    </Flex>
  );
};

export default BasicLayout;
