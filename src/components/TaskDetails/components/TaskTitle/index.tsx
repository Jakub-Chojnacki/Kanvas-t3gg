"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Box } from "@mantine/core";
import StarterKit from "@tiptap/starter-kit";

const TaskTitle = ({ editorContent }: { editorContent: string }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: editorContent,
  });

  return (
    <Box className="w-[100%]">
      <EditorContent editor={editor} />
    </Box>
  );
};

export default TaskTitle;
