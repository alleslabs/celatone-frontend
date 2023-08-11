import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { MessageTabs } from "./MessageInputSwitch";

interface MessageInputContentProps {
  currentTab: MessageTabs;
  jsonContent: ReactNode;
  schemaContent: ReactNode;
}

const resolveTabDisplay = (
  current: MessageTabs,
  target: MessageTabs
): BoxProps["display"] => {
  return current === target ? "block" : "none";
};

export const MessageInputContent = ({
  currentTab,
  jsonContent,
  schemaContent,
}: MessageInputContentProps) => {
  return (
    <Box
      sx={{
        "& .json-input": {
          display: resolveTabDisplay(currentTab, MessageTabs.JSON_INPUT),
        },
        "& .your-schema": {
          display: resolveTabDisplay(currentTab, MessageTabs.YOUR_SCHEMA),
        },
      }}
    >
      <div className="json-input">{jsonContent}</div>
      <div className="your-schema">{schemaContent}</div>
    </Box>
  );
};
