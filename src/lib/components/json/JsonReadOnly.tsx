import { Text, Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { CopyButton } from "../copy";
import { useTrack } from "lib/amplitude";
import { jsonLineCount, jsonValidate } from "lib/utils";

import { ViewFullMsgButton } from "./ViewFullMsgButton";

const JsonEditor = dynamic(() => import("lib/components/json/JsonEditor"), {
  ssr: false,
});

interface JsonReadOnlyProps {
  topic?: string;
  labelBgColor?: string;
  text: string;
  canCopy?: boolean;
  isExpandable?: boolean;
  showLines?: number;
  fullWidth?: boolean;
  amptrackSection?: string;
}

const THRESHOLD_LINES = 16;

const JsonReadOnly = ({
  topic,
  labelBgColor = "background.main",
  text,
  canCopy,
  isExpandable,
  showLines,
  fullWidth,
  amptrackSection,
}: JsonReadOnlyProps) => {
  const [viewFull, setViewFull] = useState(false);
  const { trackUseExpand } = useTrack();

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
      minH={{ base: "360px", md: "auto" }}
      p="16px 12px"
      position="relative"
      borderWidth="thin"
      borderColor={!isJsonValid ? "error.main" : "gray.700"}
      borderRadius="8px"
      transition="all 0.25s ease-in-out"
      _hover={{
        borderColor: isJsonValid && "gray.600",
        "& .copy-button-box": { display: "block" },
      }}
      w={fullWidth ? "full" : undefined}
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
          w="fit-content"
          background={labelBgColor}
          color={!isJsonValid ? "error.main" : "text.dark"}
          fontSize="12px"
          position="absolute"
        >
          {topic}
        </Text>
      )}
      {showExpandButton && (
        <ViewFullMsgButton
          onClick={() => {
            trackUseExpand({
              action: viewFull ? "collapse" : "expand",
              component: "json",
              section: amptrackSection,
            });
            setViewFull((prev) => !prev);
          }}
          viewFull={viewFull}
        />
      )}
      {canCopy && (
        <Box
          position="absolute"
          top="10px"
          right="10px"
          className="copy-button-box"
          display="none"
        >
          <CopyButton value={text} amptrackSection={amptrackSection} />
        </Box>
      )}
    </Box>
  );
};

export default JsonReadOnly;
