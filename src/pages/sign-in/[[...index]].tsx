import { SignIn } from "@clerk/clerk-react";
import { Center } from "@mantine/core";

export default function SignInPage() {
  return (
    <Center>
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-logoPurple-100 hover:bg-logoPurple-200 text-sm normal-case",
            footerActionLink: "text-logoPurple-100 hover:text-logoPurple-200",
          },
        }}
      />
    </Center>
  );
}
