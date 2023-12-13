import { Box, Button, Divider, Flex, Modal, Select, Text } from "@mantine/core";
import React, { useMemo } from "react";
import SettingSelect from "../SettingSelect";
import { RouterOutputs, api } from "~/utils/api";
import { useDisclosure } from "@mantine/hooks";
import UserAvatarWithName from "~/components/UserAvatarWithName";
import toast from "react-hot-toast";
import formatDateToFE from "~/utils/formatDateToFE";

interface IRightDetailsColumn {
  taskData: RouterOutputs["tasks"]["getById"];
}

const RightDetailsColumn: React.FC<IRightDetailsColumn> = ({ taskData }) => {
  const ctx = api.useContext();
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

  const assignedMembersIds = useMemo(
    () => assignedMembers.map((member) => member.id),
    [assignedMembers]
  );

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

  const handleChangeStatus = (value: string) => {
    updateTask({ taskId: taskData.id, columnId: value });
  };

  const handleToggleUserAssignment = async (userId: string): Promise<void> => {
    const userIsAssigned = assignedMembers?.find((user) => user.id === userId);

    try {
      if (!userIsAssigned) {
        assignPerson({
          taskId: taskData.id,
          userId,
        });
      } else {
        deleteAssignedPerson({
          taskId: taskData.id,
          userId,
        });
      }
    } catch (e) {
      toast.error("Couldn't change the assigned person");
    }
  };

  return (
    <Flex direction={"column"} gap="1em" className="min-w-max p-4">
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
        <Text>{formatDateToFE(createdAt)}</Text>
      </SettingSelect>

      <Divider />
      <Text weight="bold">Assigned</Text>
      <Box className="flex flex-col gap-4">
        <Flex direction="column" gap={8}>
          {assignedMembers?.length ? (
            assignedMembers.map((user) => <UserAvatarWithName user={user} />)
          ) : (
            <></>
          )}
        </Flex>
        <Button variant="outline" color="gray" onClick={openModal}>
          + Add assignees
        </Button>
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          centered
          title={
            <Text size="xl" weight="bold" align="center">
              Select assigned user
            </Text>
          }
        >
          <Box className="flex flex-col gap-4">
            {membersData?.map((user) => {
              const isUserAssigned = assignedMembersIds.includes(user.id);
              const commonClassNames =
                "p-2 border-solid border-[1px] border-l-0 border-r-0 border-mantineDark-4";
              return (
                <Box
                  className={
                    isUserAssigned
                      ? `${commonClassNames} bg-mantineDark-4`
                      : `${commonClassNames}`
                  }
                  onClick={async () => handleToggleUserAssignment(user.id)}
                >
                  <UserAvatarWithName user={user} pointer />
                </Box>
              );
            })}
          </Box>
        </Modal>
      </Box>
      <Divider />
    </Flex>
  );
};

export default RightDetailsColumn;
