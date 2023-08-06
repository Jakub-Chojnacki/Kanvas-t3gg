import React from "react";
import { SignUpButton as ClerkSignUpButton } from "@clerk/nextjs";
import { Button } from "@mantine/core";

const SignUpButton = () => {
  return (
    <ClerkSignUpButton>
      <Button>Sign up</Button>
    </ClerkSignUpButton>
  );
};

export default SignUpButton;
