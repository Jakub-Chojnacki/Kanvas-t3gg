"use client";
import { useEffect } from "react";

import { useDebouncedState } from "@mantine/hooks";

import { Box } from "@mantine/core";

export interface ITaskTitle {
  title: string;
  handleSaveTitle: (newTitle: string) => void;
}

const TaskTitle: React.FC<ITaskTitle> = ({ title, handleSaveTitle }) => {
  const [taskTitle, setTaskTitle] = useDebouncedState(title, 250);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (
      e.currentTarget.textContent === null ||
      e.currentTarget.textContent === taskTitle.trim()
    )
      return;
    setTaskTitle(e.currentTarget.textContent.trim() || "");
  };

  useEffect(() => {
    handleSaveTitle(taskTitle);
  }, [taskTitle]);

  return (
    <Box className="my-2 w-[100%] text-3xl">
      <Box
        spellCheck={false}
        contentEditable
        suppressContentEditableWarning
        className="w-[100%] p-2"
        onInput={handleInput}
      >
        {taskTitle}
      </Box>
    </Box>
  );
};

export default TaskTitle;
