import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

import { Box } from "@chakra-ui/react";
import { useCelatoneApp } from "lib/app-provider";
import { useRef } from "react";
import AceEditor from "react-ace";

import { CopyButton } from "../copy";

interface TextReadOnlyProps {
  text: string;
  canCopy?: boolean;
  showLines?: number;
}

export const TextReadOnly = ({
  canCopy,
  showLines,
  text,
}: TextReadOnlyProps) => {
  const editorRef = useRef<AceEditor>(null);
  const { theme } = useCelatoneApp();

  return (
    <Box
      _hover={{
        "& .copy-button-box": { display: "block" },
        borderColor: "gray.600",
      }}
      borderColor="gray.700"
      borderRadius="8px"
      borderWidth="thin"
      minH={{ base: "360px", md: "auto" }}
      position="relative"
      px={3}
      py={4}
      transition="all 0.25s ease-in-out"
    >
      <AceEditor
        className="text-editor"
        style={{
          background: "transparent",
          color: "text.main",
          offset: 0,
          width: "100%",
        }}
        editorProps={{ $blockScrolling: true }}
        fontSize="14px"
        mode="text"
        readOnly
        setOptions={{
          indentedSoftWrap: false,
          maxLines: showLines ?? Infinity,
          minLines: showLines,
          printMargin: false,
          showGutter: false,
          tabSize: 2,
          useWorker: false,
        }}
        theme={theme.jsonTheme}
        value={text}
        wrapEnabled
        ref={editorRef}
      />
      {canCopy && (
        <Box
          className="copy-button-box"
          display="none"
          position="absolute"
          right="10px"
          top="10px"
        >
          <CopyButton value={text} />
        </Box>
      )}
    </Box>
  );
};
