import React from "react";
import toast from "react-hot-toast";

import BasicEditor from "~/components/BasicEditor";
import { api } from "~/utils/api";

export interface IAddComment {
  taskId: string;
}

const AddComment: React.FC<IAddComment> = ({ taskId }) => {
  const ctx = api.useContext();
  const { mutate: addComment } = api.comments.create.useMutation({
    onSuccess: async () => {
      await ctx.comments.getCommentsByTask.invalidate({ taskId });
      toast.success("A comment has been added.");
    },
  });

  const handleSaveComment = (comment: string): void => {
    console.log(comment);
    addComment({ content: comment, taskId });
  };
  return (
    <div>
      <BasicEditor
        content=""
        handleSave={handleSaveComment}
        placeholder="Add a comment"
      />
    </div>
  );
};

export default AddComment;
