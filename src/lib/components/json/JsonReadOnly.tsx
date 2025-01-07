import { Box, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { CopyButton } from "../copy";
import { trackUseExpand } from "lib/amplitude";
import { jsonLineCount, jsonValidate } from "lib/utils";

import { ViewFullMsgButton } from "./ViewFullMsgButton";

const JsonEditor = dynamic(() => import("lib/components/json/JsonEditor"), {
  ssr: false,
});

interface JsonReadOnlyProps {
  amptrackSection?: string;
  canCopy?: boolean;
  fullWidth?: boolean;
  isExpandable?: boolean;
  labelBgColor?: string;
  showLines?: number;
  text: string;
  topic?: string;
}

const THRESHOLD_LINES = 16;

const JsonReadOnly = ({
  amptrackSection,
  canCopy,
  fullWidth,
  isExpandable,
  labelBgColor = "background.main",
  showLines,
  text,
  topic,
}: JsonReadOnlyProps) => {
  const [viewFull, setViewFull] = useState(false);

  const isJsonValid = useMemo(() => {
    return jsonValidate(text) === null || text.length === 0;
  }, [text]);

  const actualShowLines = useMemo(() => {
    const lineCount = showLines ?? jsonLineCount(text);

    if (isExpandable) {
      return viewFull ? lineCount : Math.min(lineCount, THRESHOLD_LINES);
    }

    // for query response json viewer
    return Math.max(lineCount, THRESHOLD_LINES);
  }, [isExpandable, showLines, text, viewFull]);

  const showExpandButton =
    isExpandable && jsonLineCount(text) > THRESHOLD_LINES;

  return (
    <Box
      borderWidth="thin"
      minH={{ base: "360px", md: "auto" }}
      p="16px 12px"
      w={fullWidth ? "full" : undefined}
      _hover={{
        "& .copy-button-box": { display: "block" },
        borderColor: isJsonValid && "gray.600",
      }}
      borderColor={!isJsonValid ? "error.main" : "gray.700"}
      borderRadius="8px"
      position="relative"
      transition="all 0.25s ease-in-out"
    >
      <Box p="16px 12px">
        <JsonEditor
          isValid={isJsonValid}
          readOnly
          value={text}
          showLines={actualShowLines}
        />
      </Box>
      {!!topic && (
        <Text
          w="fit-content"
          background={labelBgColor}
          color={!isJsonValid ? "error.main" : "text.dark"}
          fontSize="12px"
          position="absolute"
          top="-10px"
        >
          {topic}
        </Text>
      )}
      {showExpandButton && (
        <ViewFullMsgButton
          viewFull={viewFull}
          onClick={() => {
            trackUseExpand({
              action: viewFull ? "collapse" : "expand",
              component: "json",
              section: amptrackSection,
            });
            setViewFull((prev) => !prev);
          }}
        />
      )}
      {canCopy && (
        <Box
          className="copy-button-box"
          display="none"
          right="10px"
          position="absolute"
          top="10px"
        >
          <CopyButton value={text} amptrackSection={amptrackSection} />
        </Box>
      )}
    </Box>
  );
};

export default JsonReadOnly;
