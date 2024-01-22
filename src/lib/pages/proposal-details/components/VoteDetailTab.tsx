import type { TabProps } from "@chakra-ui/react";
import { Button, useTab, useMultiStyleConfig } from "@chakra-ui/react";

import type { Nullish } from "lib/types";

import { ProposalStepper } from "./ProposalStepper";

interface CustomTabProps extends TabProps {
  count?: Nullish<number | string>;
  isLoading?: boolean;
  title: string;
  description: string;
  step: number;
}

export const VoteDetailTab = ({
  count,
  isLoading,
  title,
  description,
  step,
  ...restProps
}: CustomTabProps) => {
  const tabProps = useTab({ ...restProps });
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      display="flex"
      w="full"
      alignItems="center"
      fontSize="14px"
      fontWeight={700}
      lineHeight="24px"
      letterSpacing="0.4px"
      variant="ghost-gray"
      mb={0}
      py={3}
      borderRadius="8px 8px 0px 0px"
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
      <ProposalStepper title={title} description={description} step={step} />
    </Button>
  );
};
