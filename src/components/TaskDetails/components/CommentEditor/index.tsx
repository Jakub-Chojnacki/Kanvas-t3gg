import React, { useEffect, useState } from "react";

import { RichTextEditor } from "@mantine/tiptap";
import { Flex } from "@mantine/core";
import StarterKit from "@tiptap/starter-kit";

import { useEditor } from "@tiptap/react";
import { useDebouncedState } from "@mantine/hooks";

import BasicButton from "~/components/BasicButton";

export interface ICommentEditor {
  content: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSaveEdit: (content: string) => void;
}
const CommentEditor: React.FC<ICommentEditor> = ({
  content,
  isEditing,
  setIsEditing,
  handleSaveEdit,
}) => {
  const [editorContent, setEditorContent] = useDebouncedState(content, 500);
  const [prevContent, setPrevContent] = useState(content);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: "p-0",
      },
    },
    editable: isEditing,
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML());
    },
  });

  useEffect(() => {
    editor?.setEditable(isEditing);
    if (isEditing) setPrevContent(editorContent);
  }, [isEditing]);

  const handleClickClose = (): void => {
    setIsEditing(false);
    setEditorContent(prevContent);
    editor?.commands.setContent(prevContent);
  };

  const handleClickSave = (): void => {
    handleSaveEdit(editorContent);
  };

  return (
    <Flex direction="column">
      <RichTextEditor
        editor={editor}
        classNames={{
          root: `w-[100%] ${isEditing ? "" : "border-0"}`,
          content: `bg-transparent ${isEditing ? "" : "[&>div]:!p-0"}`,
        }}
        suppressContentEditableWarning
        contentEditable={isEditing}
      >
        {isEditing && (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}

        <RichTextEditor.Content />
      </RichTextEditor>

      {isEditing && (
        <Flex className="my-4" gap={8}>
          <BasicButton onClick={handleClickSave}>Save</BasicButton>
          <BasicButton isOutline onClick={handleClickClose}>
            Cancel
          </BasicButton>
        </Flex>
      )}
    </Flex>
  );
};

export default CommentEditor;
