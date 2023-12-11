import React from "react";

import { Divider, Text } from "@mantine/core";
import BasicEditor from "~/components/BasicEditor";

interface ITaskContent {
  content: string;
  handleSaveContent: (newContent: string) => void;
}
const TaskContent: React.FC<ITaskContent> = ({
  content,
  handleSaveContent,
}) => {
  return (
    <React.Fragment>
      <Divider />
      <Text weight="bold" size="xl" className="my-4">
        Description
      </Text>
      <BasicEditor content={content} handleSave={handleSaveContent} />
    </React.Fragment>
  );
};

export default TaskContent;
