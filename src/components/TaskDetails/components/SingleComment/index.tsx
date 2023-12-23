import React, { useState } from "react";
import { RouterOutputs, api } from "~/utils/api";

import { useUser } from "@clerk/nextjs";
import { useDisclosure, useHover } from "@mantine/hooks";

import getUserFullName from "~/utils/getUserFullName";
import formatDateToLongFE from "~/utils/formatDateToLongFE";

import { Avatar, Flex, Text, ActionIcon } from "@mantine/core";
import CommentEditor from "../CommentEditor";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import toast from "react-hot-toast";
import ConfirmationModal from "~/components/ConfirmationModal";

export interface ISingleComment {
  comment: RouterOutputs["comments"]["getCommentsByTask"][0];
  taskId: string;
}
const SingleComment: React.FC<ISingleComment> = ({ comment, taskId }) => {
  const { author, createdAt, id } = comment;
  const { user } = useUser();
  const { hovered, ref } = useHover();
  const [opened, { open, close }] = useDisclosure(false);
  const ctx = api.useContext();

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: deleteComment } = api.comments.delete.useMutation({
    onSuccess: async () => {
      await ctx.comments.getCommentsByTask.invalidate({ taskId });
      toast.success("A comment has been deleted.");
      close();
    },
  });

  const { mutate: editComment } = api.comments.update.useMutation({
    onSuccess: async () => {
      await ctx.comments.getCommentsByTask.invalidate({ taskId });
      toast.success("A comment has been updated.");
    },
  });

  const handleOpenEdit = (): void => setIsEditing(true);

  const handleClickDeleteComment = (): void => {
    open();
  };
  const handleDeleteComment = (): void => {
    deleteComment({ commentId: id });
  };

  const handleSaveEdit = (content: string): void => {
    editComment({ commentId: id, content });
    setIsEditing(false);
  };

  return (
    <Flex ref={ref} align="center" gap="lg" className="my-2">
      <ConfirmationModal
        opened={opened}
        close={close}
        title="Comment deletion"
        modalText="Are you sure you want to delete this comment?"
        onConfirm={handleDeleteComment}
      />

      {!isEditing && (
        <Avatar radius="xs" size="md" src={author?.profileImageUrl} />
      )}
      <Flex direction="column" className="w-[100%]">
        <Flex gap={12} justify="space-between">
          <Flex gap={12} align="center">
            <Text weight="bold">{getUserFullName(author)}</Text>
            <Text className="text-gray-500 ">
              {formatDateToLongFE(createdAt)}
            </Text>
          </Flex>
          {user?.id === author?.id && (
            <Flex className={hovered ? "" : "hidden"}>
              <ActionIcon size="sm" onClick={handleOpenEdit}>
                <IconEdit />
              </ActionIcon>
              <ActionIcon size="sm" onClick={handleClickDeleteComment}>
                <IconTrash />
              </ActionIcon>
            </Flex>
          )}
        </Flex>
        <CommentEditor
          content={comment.content}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSaveEdit={handleSaveEdit}
        />
      </Flex>
    </Flex>
  );
};

export default SingleComment;
