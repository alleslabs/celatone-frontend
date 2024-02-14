import type { TabProps } from "@chakra-ui/react";
import { Button, useTab, useMultiStyleConfig } from "@chakra-ui/react";

import { ProposalStepper } from "../proposal-stepper";
import type { ProposalData } from "lib/types";

interface VoteDetailsTabProps extends TabProps {
  step: number;
  proposalData: ProposalData;
}

export const VoteDetailsTab = ({
  step,
  proposalData,
  ...restProps
}: VoteDetailsTabProps) => {
  const tabProps = useTab({ ...restProps });
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      display="flex"
      w="full"
      mb={0}
      py={3}
      borderRadius="8px 8px 0px 0px"
      color="text.main"
      sx={{
        "&[aria-selected=true]": {
          background: "gray.800",
          border: "1px solid",
          borderColor: "gray.700",
          opacity: "100%",
          borderBottomColor: "transparent",
        },
        "&[aria-selected=false]": {
          background: "transparent",
          border: "1px solid",
          borderColor: "gray.700",
          opacity: "70%",
          borderBottomColor: "transparent",
        },
      }}
      _active={{
        bg: "unset",
      }}
      {...tabProps}
    >
      <ProposalStepper step={step} proposalData={proposalData} />
    </Button>
  );
};
