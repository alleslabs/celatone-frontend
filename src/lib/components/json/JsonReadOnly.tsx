import type { LayoutProps } from "@chakra-ui/react";
import { Text, Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { CopyButton } from "../CopyButton";
import { jsonValidate } from "lib/utils";

import { ViewFullMsgButton } from "./ViewFullMsgButton";

const BUTTON_EXPAND_PADDING = "60px";

const JsonEditor = dynamic(() => import("lib/components/json/JsonEditor"), {
  ssr: false,
});

interface JsonReadOnlyProps {
  topic?: string;
  text: string;
  height?: LayoutProps["height"];
  canCopy?: boolean;
  canViewFull?: boolean;
  disableResizing?: boolean;
}

const JsonReadOnly = ({
  topic,
  text,
  height,
  canCopy,
  canViewFull,
  disableResizing,
}: JsonReadOnlyProps) => {
  const [viewFull, setViewFull] = useState(false);

  const isJsonValid = useMemo(() => {
    return jsonValidate(text) === null || text.length === 0;
  }, [text]);

  const zeroHeight = height === 0;
  return (
    <Box
      m={zeroHeight ? 0 : "8px 0 16px"}
      p={
        zeroHeight
          ? 0
          : `16px 12px ${viewFull ? BUTTON_EXPAND_PADDING : "16px"}`
      }
      borderWidth={zeroHeight ? "none" : "thin"}
      borderColor={!isJsonValid ? "error.main" : "pebble.700"}
      borderRadius="4px"
      position="relative"
      transition="all .2s"
      _hover={{
        borderColor: isJsonValid && "pebble.600",
        "& .copy-button-box": { display: "block" },
      }}
    >
      <JsonEditor
        value={text}
        readOnly
        isValid={isJsonValid}
        height={height}
        showFullMsg={viewFull}
        disableResizing={disableResizing}
      />
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
      {canViewFull && (
        <ViewFullMsgButton
          onClick={() => setViewFull((prev) => !prev)}
          viewFull={viewFull}
        />
      )}
      {canCopy && !zeroHeight && (
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

export default JsonReadOnly;
