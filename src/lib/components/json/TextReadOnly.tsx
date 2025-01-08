import { Box } from "@chakra-ui/react";
import { useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import { CopyButton } from "../copy";
import { useCelatoneApp } from "lib/app-provider";

interface TextReadOnlyProps {
  canCopy?: boolean;
  text: string;
}

export const TextReadOnly = ({ canCopy, text }: TextReadOnlyProps) => {
  const editorRef = useRef<AceEditor>(null);
  const { theme } = useCelatoneApp();

  return (
    <Box
      borderWidth="thin"
      minH={{ base: "360px", md: "auto" }}
      px={3}
      py={4}
      _hover={{
        "& .copy-button-box": { display: "block" },
        borderColor: "gray.600",
      }}
      borderColor="gray.700"
      borderRadius="8px"
      position="relative"
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
        readOnly
        theme={theme.jsonTheme}
        value={text}
        wrapEnabled
        editorProps={{ $blockScrolling: true }}
        fontSize="14px"
        mode="text"
        setOptions={{
          indentedSoftWrap: false,
          maxLines: Infinity,
          printMargin: false,
          showGutter: false,
          tabSize: 2,
          useWorker: false,
        }}
        ref={editorRef}
      />
      {canCopy && (
        <Box
          className="copy-button-box"
          display="none"
          right="10px"
          position="absolute"
          top="10px"
        >
          <CopyButton value={text} />
        </Box>
      )}
    </Box>
  );
};
