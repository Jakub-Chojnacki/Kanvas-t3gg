import React from "react";
import toast from "react-hot-toast";

import BasicEditor from "~/components/BasicEditor";
import { api } from "~/utils/api";

export interface IAddComment {
  taskId: string;
}

const AddComment: React.FC<IAddComment> = ({ taskId }) => {
  const ctx = api.useContext();
  const mutation = api.comments.create.useMutation({
    onSuccess: async () => {
      await ctx.comments.getCommentsByTask.invalidate({ taskId });
    },
  });

  const handleSaveComment = (comment: string): void => {
    const promise = new Promise((resolve, reject) => {
      mutation.mutate(
        { content: comment, taskId }, 
        {
          onSuccess: (data) => {
            resolve(data);
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });

    toast.promise(promise, {
      loading: "Adding a comment...",
      success: "Your comment was added!",
      error: "Failed while trying to add a comment!",
    });
  };

  return (
    <div>
      <BasicEditor
        content=""
        handleSave={handleSaveComment}
        placeholder="Add a comment"
        resetContentAfterSubmit
      />
    </div>
  );
};

export default AddComment;
