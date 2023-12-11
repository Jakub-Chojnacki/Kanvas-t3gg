import React, { useState } from "react";
import { Flex } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

import { useDebouncedState } from "@mantine/hooks";

import BasicButton from "../BasicButton";

export interface IBasicEditor {
  content: string;
  handleSave: (newContent: string) => void;
  placeholder?: string;
  editorProps?: Editor;
}

const BasicEditor: React.FC<IBasicEditor> = ({
  content,
  handleSave,
  placeholder = "",
  editorProps,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editorContent, setEditorContent] = useDebouncedState(content, 500);
  const [prevContent, setPrevContent] = useState(content);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: editorContent,
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML());
    },
  });

  const handleOpenEdit = (): void => {
    setIsEditable(true);
    setPrevContent(editorContent);
  };
  const handleClickSave = (): void => {
    handleSave(editorContent);
    setIsEditable(false);
  };
  const handleCloseEdit = (): void => {
    setIsEditable(false);
    setEditorContent(prevContent);
    editor?.commands.setContent(prevContent);
  };

  return (
    <React.Fragment>
      <RichTextEditor
        editor={editor}
        classNames={{
          root: "w-[100%]",
          content: !isEditable ? "hover:bg-mantineGray-8" : "",
        }}
        onClick={handleOpenEdit}
        contentEditable={isEditable}
        suppressContentEditableWarning
        {...editorProps}
      >
        {isEditable && (
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
      {isEditable && (
        <Flex className="my-4" gap={8}>
          <BasicButton onClick={handleClickSave}>Save</BasicButton>
          <BasicButton isOutline onClick={handleCloseEdit}>
            Cancel
          </BasicButton>
        </Flex>
      )}
    </React.Fragment>
  );
};

export default BasicEditor;
