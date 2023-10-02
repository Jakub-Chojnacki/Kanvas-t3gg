import React from "react";
import { SignUpButton as ClerkSignUpButton } from "@clerk/nextjs";
import { Button } from "@mantine/core";

const SignUpButton = () => {
  return (
    <ClerkSignUpButton>
      <Button className="bg-logoPurple-100 hover:bg-logoPurple-200 ">Sign up</Button>
    </ClerkSignUpButton>
  );
};

export default SignUpButton;
