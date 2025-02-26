import { Box } from "@chakra-ui/react";
import { useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import { useCelatoneApp } from "lib/app-provider";
import { CopyButton } from "../copy";

interface TextReadOnlyProps {
  text: string;
  canCopy?: boolean;
  showLines?: number;
}

export const TextReadOnly = ({
  text,
  canCopy,
  showLines,
}: TextReadOnlyProps) => {
  const editorRef = useRef<AceEditor>(null);
  const { theme } = useCelatoneApp();

  return (
    <Box
      minH={{ base: "360px", md: "auto" }}
      px={3}
      py={4}
      position="relative"
      borderWidth="thin"
      borderColor="gray.700"
      borderRadius="8px"
      transition="all 0.25s ease-in-out"
      _hover={{
        borderColor: "gray.600",
        "& .copy-button-box": { display: "block" },
      }}
    >
      <AceEditor
        ref={editorRef}
        mode="text"
        theme={theme.jsonTheme}
        fontSize="14px"
        readOnly
        style={{
          width: "100%",
          background: "transparent",
          color: "text.main",
          offset: 0,
        }}
        className="text-editor"
        wrapEnabled
        setOptions={{
          tabSize: 2,
          useWorker: false,
          showGutter: false,
          printMargin: false,
          indentedSoftWrap: false,
          maxLines: showLines ?? Infinity,
          minLines: showLines,
        }}
        value={text}
        editorProps={{ $blockScrolling: true }}
      />
      {canCopy && (
        <Box
          position="absolute"
          top="10px"
          right="10px"
          className="copy-button-box"
          display="none"
        >
          <CopyButton value={text} />
        </Box>
      )}
    </Box>
  );
};
