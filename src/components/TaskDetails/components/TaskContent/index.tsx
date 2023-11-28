import { Box } from "@mantine/core";
import React from "react";

interface ITaskContent {
  content: string;
}
const TaskContent: React.FC<ITaskContent> = ({ content }) => {
  return <Box>{content}</Box>;
};

export default TaskContent;
