import React from "react";
import { api } from "~/utils/api";

import { Text, Flex } from "@mantine/core";

import SingleComment from "../SingleComment";
import AddComment from "../AddComment";

export interface ICommentList {
  taskId: string;
}
const CommentList: React.FC<ICommentList> = ({ taskId }) => {
  const { data: comments } = api.comments.getCommentsByTask.useQuery({
    taskId,
  });

  return (
    <Flex direction="column">
      <Text weight="bold" size="xl" className="my-4">
        Comments
      </Text>
      <AddComment taskId={taskId} />
      <Flex direction="column" className="my-4">
        {comments?.map((comment) => {
          return <SingleComment comment={comment} />;
        })}
      </Flex>
    </Flex>
  );
};

export default CommentList;
