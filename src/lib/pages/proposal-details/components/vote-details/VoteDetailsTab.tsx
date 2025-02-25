import type { TabProps } from "@chakra-ui/react";
import { Button, useMultiStyleConfig, useTab } from "@chakra-ui/react";

import type { ProposalData } from "lib/types";
import { ProposalStepper } from "../proposal-stepper";

interface VoteDetailsTabProps extends TabProps {
  step: number;
  proposalData: ProposalData;
}

export const VoteDetailsTab = ({
  step,
  proposalData,
  isDisabled,
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
          borderBottomColor: "gray.800",
        },
        "&[aria-selected=false]": {
          background: "transparent",
          border: "1px solid",
          borderColor: "gray.700",
          opacity: "70%",
          borderBottomColor: "transparent",
        },
      }}
      isDisabled={isDisabled}
      _active={{
        bg: "unset",
      }}
      {...tabProps}
    >
      <ProposalStepper step={step} proposalData={proposalData} />
    </Button>
  );
};
