import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { ContractInteractionTabs } from "lib/components/ContractInteractionSwitch";
import type { Option } from "lib/types";

interface InteractionWrapperProps {
  currentTab: Option<ContractInteractionTabs>;
  queryContent: ReactNode;
  executeContent: ReactNode;
}
const resolveTabDisplay = (
  current: Option<ContractInteractionTabs>,
  target: ContractInteractionTabs
): BoxProps["display"] => {
  return current === target ? "block" : "none";
};

export const InteractionWrapper = ({
  currentTab,
  queryContent,
  executeContent,
}: InteractionWrapperProps) => (
  <Box
    sx={{
      "& .query": {
        display: resolveTabDisplay(currentTab, ContractInteractionTabs.QUERY),
      },
      "& .execute": {
        display: resolveTabDisplay(currentTab, ContractInteractionTabs.EXECUTE),
      },
    }}
  >
    <div className="query">{queryContent}</div>
    <div className="execute">{executeContent}</div>
  </Box>
);
