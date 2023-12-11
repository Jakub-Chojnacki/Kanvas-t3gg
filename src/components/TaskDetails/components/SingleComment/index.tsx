import React, { useState } from "react";
import { RouterOutputs } from "~/utils/api";

import { useUser } from "@clerk/nextjs";
import { useHover } from "@mantine/hooks";

import getUserFullName from "~/utils/getUserFullName";
import formatDateToLongFE from "~/utils/formatDateToLongFE";

import { Avatar, Flex, Text, ActionIcon } from "@mantine/core";
import CommentEditor from "../CommentEditor";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export interface ISingleComment {
  comment: RouterOutputs["comments"]["getCommentsByTask"][0];
}
const SingleComment: React.FC<ISingleComment> = ({ comment }) => {
  const { author, createdAt } = comment;
  const { user } = useUser();
  const { hovered, ref } = useHover();

  const [isEditing, setIsEditing] = useState(false);

  const handleOpenEdit = (): void => setIsEditing(true);

  const handleDeleteComment = (): void => {
    //TODO: Delete comment
  };

  const handleSaveEdit = (): void => {
    //TODO: Save comment
    setIsEditing(false);
  };

  return (
    <Flex ref={ref} align="center" gap="lg" className="my-2">
      <Avatar radius="xs" size="md" src={author?.profileImageUrl} />
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
              <ActionIcon size="sm" onClick={handleDeleteComment}>
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
