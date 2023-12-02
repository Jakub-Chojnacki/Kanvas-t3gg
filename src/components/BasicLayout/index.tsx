import { Flex, useMantineTheme, Navbar, AppShell } from "@mantine/core";
import React, { ReactNode, useState } from "react";

import AppHeader from "../AppHeader";
import { headerHeight } from "../AppHeader";

interface IBasicLayoutProps {
  children?: ReactNode;
  sideNav?: ReactNode;
  paddingTop?: number | string;
}

const BasicLayout = ({ children, sideNav, paddingTop }: IBasicLayoutProps) => {
  const theme = useMantineTheme();
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Flex w="100%" mih="100vh" direction="column">
      <AppHeader />
      <Flex
        bg={theme.colorScheme === "dark" ? theme.colors.gray[9] : "white"}
        w="100%"
        h={`calc(100vh - ${headerHeight}px)`}
        align="center"
        justify="center"
      >
        <AppShell
          styles={{
            main: {
              paddingTop: paddingTop ?? '1rem',
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[9]
                  : "white",
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
                bg={
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : "white"
                }
                className="border-solid border-0 border-r-2  border-mantineGray-8"
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
