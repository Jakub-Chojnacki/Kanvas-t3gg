import { useForm, zodResolver } from "@mantine/form";
import z from "zod";
import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Text,
  TextInput,
} from "@mantine/core";
import { RouterOutputs, api } from "~/utils/api";
import BasicButton from "../BasicButton";
import { useRouter } from "next/router";

const CreateBoardForm = () => {
  const { push } = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [createdBoard, setCreatedBoard] = useState<
    RouterOutputs["boards"]["create"] | null
  >(null);
  const { mutate: createBoard } = api.boards.create.useMutation({
    onMutate: async () => {
      setShowLoader(true);
    },
    onSuccess: async (data) => {
      setCreatedBoard(data);
      setShowLoader(false);
    },
  });

  const schema = z.object({
    name: z.string().min(1, { message: "Your board must have a name!" }),
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      name: "",
    },
  });

  const handleSubmit = async ({ name }: { name: string }): Promise<void> => {
    createBoard({ name });
  };

  const handleOpenNewBoard = (): void => {
    push(`/board/${createdBoard?.id}`);
  };

  return (
    <Box my="md">
      {!showLoader && !createdBoard && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Board name..."
            {...form.getInputProps("name")}
          />

          <Group mt="md" className="justify-end">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      )}
      {showLoader && (
        <Flex direction="column" gap={16} align="center">
          <Loader />
          <Text>Your board is being created...</Text>
        </Flex>
      )}
      {createdBoard && (
        <Flex direction="column" gap={16} align="center">
          <Text>A board has been created!</Text>
          <BasicButton onClick={handleOpenNewBoard}>Open the board</BasicButton>
        </Flex>
      )}
    </Box>
  );
};

export default CreateBoardForm;
