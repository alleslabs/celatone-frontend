import { Text, Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { CopyButton } from "../copy";
import { jsonLineCount, jsonValidate } from "lib/utils";

import { ViewFullMsgButton } from "./ViewFullMsgButton";

const JsonEditor = dynamic(() => import("lib/components/json/JsonEditor"), {
  ssr: false,
});

interface JsonReadOnlyProps {
  topic?: string;
  text: string;
  canCopy?: boolean;
  isExpandable?: boolean;
  showLines?: number;
}

const THRESHOLD_LINES = 16;

const JsonReadOnly = ({
  topic,
  text,
  canCopy,
  isExpandable,
  showLines,
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
      position="relative"
      borderWidth="thin"
      borderColor={!isJsonValid ? "error.main" : "pebble.700"}
      borderRadius="8px"
      transition="all .25s ease-in-out"
      _hover={{
        borderColor: isJsonValid && "pebble.600",
        "& .copy-button-box": { display: "block" },
      }}
    >
      <Box p="16px 12px">
        <JsonEditor
          value={text}
          readOnly
          isValid={isJsonValid}
          showLines={actualShowLines}
        />
      </Box>
      {!!topic && (
        <Text
          top="-10px"
          background="background.main"
          color={!isJsonValid ? "error.main" : "text.dark"}
          fontSize="12px"
          position="absolute"
        >
          {topic}
        </Text>
      )}
      {showExpandButton && (
        <ViewFullMsgButton
          onClick={() => setViewFull((prev) => !prev)}
          viewFull={viewFull}
        />
      )}
      {canCopy && (
        <Box
          position="absolute"
          top="10px"
          right="10px"
          className="copy-button-box"
        >
          <CopyButton value={text} />
        </Box>
      )}
    </Box>
  );
};

export default JsonReadOnly;
