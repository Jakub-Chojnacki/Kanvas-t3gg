import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import {
  Burger,
  Header,
  MediaQuery,
  Text,
  useMantineTheme,
  Flex,
} from "@mantine/core";

import SignInButton from "../SignInButton";
import SignUpButton from "../SignUpButton"
import ColorSchemeToggle from "../ColorSchemeToggle";

export const headerHeight = 70 ;

const AppHeader = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <Header height={headerHeight} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Flex
          gap="md"
          justify="space-between"
          align="center"
          direction="row"
          w="100%"
        >
          <Text size={"xl"}>Kanvas</Text>
          <Flex gap="sm" align="center">
            <ColorSchemeToggle />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton />
              <SignUpButton/>
            </SignedOut>
          </Flex>
        </Flex>
      </div>
    </Header>
  );
};

export default AppHeader;
