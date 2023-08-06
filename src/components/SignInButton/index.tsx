import React from "react";
import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { Button } from "@mantine/core";

const SignInButton = () => {
  return (
    <ClerkSignInButton>
      <Button variant="outline">Login</Button>
    </ClerkSignInButton>
  );
};

export default SignInButton;
