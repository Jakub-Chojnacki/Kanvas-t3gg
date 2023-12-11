import React from "react";
import { Button } from "@mantine/core";

export interface IBasicButton extends React.ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  isOutline?: boolean;
}
const BasicButton: React.FC<IBasicButton> = ({
  isOutline = false,
  children,
  ...props
}) => {
  return (
    <Button
      variant={isOutline ? "outline" : "default"}
      className={
        isOutline
          ? "border-logoPurple-100 text-logoPurple-100"
          : "bg-logoPurple-100 hover:bg-logoPurple-200"
      }
      {...props}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
