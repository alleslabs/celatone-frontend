import type { TabProps } from "@chakra-ui/react";
import { Button, useMultiStyleConfig, useTab } from "@chakra-ui/react";

import { ProposalStepper } from "../proposal-stepper";
import type { ProposalData } from "lib/types";

interface VoteDetailsTabProps extends TabProps {
  proposalData: ProposalData;
  step: number;
}

export const VoteDetailsTab = ({
  isDisabled,
  proposalData,
  step,
  ...restProps
}: VoteDetailsTabProps) => {
  const tabProps = useTab({ ...restProps });
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      _active={{
        bg: "unset",
      }}
      display="flex"
      isDisabled={isDisabled}
      mb={0}
      py={3}
      sx={{
        "&[aria-selected=false]": {
          background: "transparent",
          border: "1px solid",
          borderBottomColor: "transparent",
          borderColor: "gray.700",
          opacity: "70%",
        },
        "&[aria-selected=true]": {
          background: "gray.800",
          border: "1px solid",
          borderBottomColor: "gray.800",
          borderColor: "gray.700",
          opacity: "100%",
        },
      }}
      w="full"
      borderRadius="8px 8px 0px 0px"
      color="text.main"
      {...tabProps}
    >
      <ProposalStepper step={step} proposalData={proposalData} />
    </Button>
  );
};
