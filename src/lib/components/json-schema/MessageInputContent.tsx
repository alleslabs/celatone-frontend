import type { BoxProps } from "@chakra-ui/react";
import type { Option } from "lib/types";
import type { ReactNode } from "react";

import { Box } from "@chakra-ui/react";

import { MessageTabs } from "./MessageInputSwitch";

interface MessageInputContentProps {
  currentTab: Option<MessageTabs>;
  jsonContent: ReactNode;
  schemaContent: ReactNode;
}

const resolveTabDisplay = (
  current: Option<MessageTabs>,
  target: MessageTabs
): BoxProps["display"] => {
  return current === target ? "block" : "none";
};

export const MessageInputContent = ({
  currentTab,
  jsonContent,
  schemaContent,
}: MessageInputContentProps) => (
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
