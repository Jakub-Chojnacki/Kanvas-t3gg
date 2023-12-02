import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  Popover,
  Select,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import SettingSelect from "../SettingSelect";
import { RouterOutputs, api } from "~/utils/api";
import { useDisclosure } from "@mantine/hooks";
import UserAvatarWithName from "~/components/UserAvatarWithName";
import toast from "react-hot-toast";

interface IRightDetailsColumn {
  taskData: RouterOutputs["tasks"]["getById"];
}

const RightDetailsColumn: React.FC<IRightDetailsColumn> = ({ taskData }) => {
  const ctx = api.useContext();
  const [opened, { close, open }] = useDisclosure(false);
  const [modalOpened, { close: closeModal, open: openModal }] =
    useDisclosure(false);

  const { id, boardId, columnId, assignedMembers, createdByUser, createdAt } =
    taskData;

  const { data: columnsData } = api.columns.getColumnsByBoardId.useQuery({
    id: boardId,
  });

  const { data: membersData } = api.boards.getBoardMembers.useQuery({
    id: boardId,
  });

  const { mutate: assignPerson } = api.tasks.assignPersonToTask.useMutation({
    onSuccess: () => {
      ctx.tasks.getTasksByBoard.invalidate({ boardId });
      ctx.tasks.getById.invalidate({ id });
    },
  });

  const { mutate: deleteAssignedPerson } =
    api.tasks.deleteAssignedPerson.useMutation({
      onSuccess: () => {
        ctx.tasks.getTasksByBoard.invalidate({ boardId });
        ctx.tasks.getById.invalidate({ id });
      },
    });

  const { mutate: updateTask } = api.tasks.updateTask.useMutation({
    onSuccess: () => {
      ctx.tasks.getTasksByBoard.invalidate({ boardId });
      ctx.tasks.getById.invalidate({ id });
    },
  });
  const mappedColumns = columnsData?.map((column) => {
    return {
      label: column.name,
      value: column.id,
    };
  });

  const mappedMembers = membersData?.map((member) => {
    return {
      label: <UserAvatarWithName user={member} />,
      value: member.id,
    };
  });
  const handleChangeStatus = (value: string) => {
    updateTask({ taskId: taskData.id, columnId: value });
  };

  const handleToggleUserAssignment = async (userId: string) => {
    const userIsAssigned = assignedMembers?.find((user) => user.id === userId);

    try {
      if (!userIsAssigned) {
        const assignedPerson = await assignPerson({
          taskId: taskData.id,
          userId,
        });
        return assignedPerson;
      } else {
        const deletedAssignedPerson = await deleteAssignedPerson({
          taskId: taskData.id,
          userId,
        });

        return deletedAssignedPerson;
      }
    } catch (e) {
      toast.error("Couldn't change the assigned person");
    }
  };

  return (
    <Flex direction={"column"} gap="1em" className="p-4">
      <SettingSelect text={"Status"}>
        <Select
          data={mappedColumns || []}
          variant="unstyled"
          styles={{
            rightSection: { display: "none" },
            input: {
              textAlign: "right",
              paddingRight: "0px",
            },
          }}
          defaultValue={columnId}
          value={columnId}
          onChange={handleChangeStatus}
        />
      </SettingSelect>
      <SettingSelect text={"Created by"}>
        <UserAvatarWithName user={createdByUser} />
      </SettingSelect>
      <SettingSelect text={"Created at"}>
        <Text>{dayjs(createdAt).format("DD.MM.YYYY")}</Text>
      </SettingSelect>

      <Divider />
      <Text weight="bold">Assigned</Text>
      <Box className="flex flex-col gap-4">
        <Box onClick={open}>
          {assignedMembers?.length ? (
            assignedMembers.map((user) => <UserAvatarWithName user={user} />)
          ) : (
            <></>
          )}
        </Box>
        <Button variant="outline" color="gray" onClick={openModal}>
          + Add assignees
        </Button>
        <Modal opened={modalOpened} onClose={closeModal} centered>
          <Box className="flex flex-col gap-4">
            {membersData?.map((user) => (
              <UserAvatarWithName user={user} pointer />
            ))}
          </Box>
        </Modal>
      </Box>
      <Divider />
    </Flex>
  );
};

export default RightDetailsColumn;
