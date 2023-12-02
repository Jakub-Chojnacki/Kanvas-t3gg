import { Box, Button, Text, Textarea, useMantineTheme } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import {useRef, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

import useHandleClickOutside from "~/hooks/useHandleClickOutside";

import { api } from "~/utils/api";

interface SimpleAddTask {
  columnId: string;
  boardId: string;
}

const schema = z.object({
  title: z.string().min(1),
  columnId: z.string(),
});

interface FormValues {
  columnId: string;
  boardId: string;
  title: string;
  content: string;
}

const SimpleAddTask: React.FC<SimpleAddTask> = ({ columnId, boardId }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const ctx = api.useContext();
  const theme = useMantineTheme()

  const toggleIsAddingTask = (): void => setIsAddingTask((prev) => !prev);
  const formRef = useRef(null);

  useHandleClickOutside(formRef, toggleIsAddingTask);

  const { mutate } = api.tasks.create.useMutation({
    onSuccess: async () => {
      toast.success("A task has been added.");
    },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
    onSettled: async () => {
      await ctx.tasks.getTasksByBoard.invalidate({ boardId });
    },
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      title: "",
      content: "",
      columnId,
      boardId,
    },
  });

  const handleSubmit = (data: FormValues): void => {
    const { columnId, boardId, title, content } = data;
    mutate({ columnId, boardId, title, content });
    toggleIsAddingTask()

    form.reset()
  };

  return (
    <Box className="p-4">
      {!isAddingTask && (
        <Box
          onClick={toggleIsAddingTask}
          className="flex w-[100%] cursor-pointer flex-row gap-3 rounded-md p-1  align-middle hover:bg-white hover:bg-opacity-10"
        >
          <IconPlus />
          <Text>Add a task</Text>
        </Box>
      )}

      {isAddingTask && (
        <Box className="scroll w-[100%] rounded-md border-[1px] border-solid border-mantineGray-8">
          <form onSubmit={form.onSubmit(handleSubmit)} ref={formRef}>
            <Textarea
              classNames={{
                input:
                  "border-none scrollbar scrollbar-thin scrollbar-thumb-gray-600 scrollbar-thumb-rounded scrollbar-h-[10px]",
              }}
              variant="default"
              placeholder="Enter task title..."
              {...form.getInputProps("title")}
            />
            <Box className="flex flex-row justify-end gap-2 align-middle" bg={theme.colorScheme === 'dark' ? theme.colors.gray[9]: 'white'}>
              <Button
                variant="subtle"
                className="h-[30px] w-[30px] p-0"
                type="submit"
              >
                <IconCheck />
              </Button>
              <Button
                variant="subtle"
                onClick={() => setIsAddingTask(false)}
                className="h-[30px] w-[30px] p-0"
              >
                <IconX />
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default SimpleAddTask;
