import {
  TextInput,
  Textarea,
  Button,
  Group,
  Box,
  MultiSelect,
  Select,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

const schema = z.object({
  title: z.string().min(1, { message: "All tasks must have a title!" }),
  content: z.string().min(1, { message: "All tasks must have content!" }),
});

interface ICreateTaskForm {
  boardId: string;
}

const CreateTaskForm: React.FC<ICreateTaskForm> = ({ boardId }) => {
  const { data: columns } = api.columns.getColumnsByBoardId.useQuery({
    id:boardId,
  });

  const columnNames = columns?.map((column) => column.name);

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      title: "",
      content: "",
      column: "",
      tags: [],
    },
  });

  const ctx = api.useContext();

  const { mutate } = api.tasks.create.useMutation({
    onSuccess: async () => {
      toast.success("A task has been added.");
    },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
  });

  const handleSubmit = () => {};

  const mockTags = [
    { value: "react", label: "React" },
    { value: "ng", label: "Angular" },
    { value: "svelte", label: "Svelte" },
    { value: "vue", label: "Vue" },
    { value: "riot", label: "Riot" },
    { value: "next", label: "Next.js" },
    { value: "blitz", label: "Blitz.js" },
  ];

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Task title..."
          {...form.getInputProps("title")}
        />

        <MultiSelect
          data={mockTags}
          label="Tags"
          placeholder="Choose some Tags..."
        />

        <Textarea
          withAsterisk
          autosize
          label="Content"
          minRows={6}
          placeholder="Input task content..."
          {...form.getInputProps("content")}
        />

        <Select
          label="Pick a column"
          placeholder="Pick one"
          data={columnNames || []}
        />

        <Group mt="md" className="justify-end">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </Box>
  );
};

export default CreateTaskForm;
