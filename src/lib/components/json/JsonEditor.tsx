import type { LayoutProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

interface JsonEditorProps {
  value: string;
  setValue: (value: string) => void;
  readOnly?: boolean;
  isValid: boolean;
  height?: LayoutProps["height"];
}

const JsonEditor = ({
  value,
  setValue,
  readOnly = false,
  isValid,
  height = "sm",
}: JsonEditorProps) => {
  const editorRef = useRef<AceEditor>(null);

  useEffect(() => {
    const resize = () => {
      if (editorRef && editorRef.current) {
        editorRef.current.editor.resize();
      }
    };
    document.addEventListener("mouseup", resize);
    return () => document.removeEventListener("mouseup", resize);
  });

  return (
    <Box height={height} resize="vertical" overflow="auto">
      <AceEditor
        ref={editorRef}
        mode="json"
        theme="monokai"
        fontSize="14px"
        readOnly={readOnly}
        style={{
          width: "100%",
          height: "99%",
          background: "transparent",
          color: readOnly && !isValid ? "#e57373" : "white",
          offset: 0,
        }}
        setOptions={{
          tabSize: 2,
          useWorker: false,
          showGutter: false,
          wrap: readOnly && !isValid,
          printMargin: false,
        }}
        onChange={setValue}
        value={value}
        editorProps={{ $blockScrolling: true }}
      />
    </Box>
  );
};

export default JsonEditor;
