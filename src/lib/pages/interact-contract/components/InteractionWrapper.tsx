import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { ContractInteractionTabs } from "lib/types";
import type { Option } from "lib/types";

interface InteractionWrapperProps {
  currentTab: Option<ContractInteractionTabs>;
  executeContent: ReactNode;
  queryContent: ReactNode;
}
const resolveTabDisplay = (
  current: Option<ContractInteractionTabs>,
  target: ContractInteractionTabs
): BoxProps["display"] => {
  return current === target ? "block" : "none";
};

export const InteractionWrapper = ({
  currentTab,
  executeContent,
  queryContent,
}: InteractionWrapperProps) => (
  <Box
    sx={{
      "& .execute": {
        display: resolveTabDisplay(currentTab, ContractInteractionTabs.Execute),
      },
      "& .query": {
        display: resolveTabDisplay(currentTab, ContractInteractionTabs.Query),
      },
    }}
  >
    <div className="query">{queryContent}</div>
    <div className="execute">{executeContent}</div>
  </Box>
);
