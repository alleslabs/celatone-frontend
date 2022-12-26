import type { LayoutProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

interface JsonEditorProps {
  value: string;
  setValue?: (value: string) => void;
  readOnly?: boolean;
  isValid: boolean;
  height?: LayoutProps["height"];
  showFullMsg?: boolean;
}

const JsonEditor = ({
  value,
  setValue,
  readOnly = false,
  isValid,
  height = "sm",
  showFullMsg,
}: JsonEditorProps) => {
  const editorRef = useRef<AceEditor>(null);
  const [boxHeight, setBoxHeight] = useState(height);

  useEffect(() => {
    if (showFullMsg && height !== 0) {
      const contentHeight =
        editorRef.current?.editor.renderer.container.clientHeight;
      const parsedHeight =
        typeof height === "string" ? parseInt(height, 10) : height;
      const targetHeight =
        contentHeight !== undefined && contentHeight > parsedHeight
          ? contentHeight
          : height;
      setBoxHeight(targetHeight);
    } else {
      setBoxHeight(height);
    }
  }, [height, showFullMsg]);

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
    <Box
      height={boxHeight}
      resize="vertical"
      overflow="auto"
      transition="all .15s"
    >
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
          maxLines: 9999,
        }}
        onChange={setValue}
        value={value}
        editorProps={{ $blockScrolling: true }}
      />
    </Box>
  );
};

export default JsonEditor;
