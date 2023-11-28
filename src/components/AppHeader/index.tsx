import Link from "next/link";
import NextImage from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import {
  Burger,
  Header,
  MediaQuery,
  useMantineTheme,
  Flex,
  Center,
} from "@mantine/core";
import image from "./logo.svg";

import SignInButton from "../SignInButton";
import SignUpButton from "../SignUpButton";
import ColorSchemeToggle from "../ColorSchemeToggle";
import BoardList from "../BoardList";

export const headerHeight = 60;

const AppHeader = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <Header
      height={headerHeight}
      p="md"
      bg={
        theme.colorScheme === "dark"
          ? theme.colors.gray[9]
          : 'white'
      }
    >
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
          <SignedOut>
            <Link href="/">
              <NextImage alt="img" src={image} width={120} height={40} />
            </Link>
          </SignedOut>
          <SignedIn>
            <Center className="gap-4">
              <Link href="/dashboard">
                <NextImage alt="img" src={image} width={120} height={40} />
              </Link>
              <BoardList />
            </Center>
          </SignedIn>
          <Flex gap="sm" align="center">
            <ColorSchemeToggle />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
          </Flex>
        </Flex>
      </div>
    </Header>
  );
};

export default AppHeader;
