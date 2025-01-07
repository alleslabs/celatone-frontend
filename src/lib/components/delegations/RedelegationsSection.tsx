import type { FlexProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";

import { RedelegationsTable, TableTitle } from "../table";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import type { Redelegation, StakingParams } from "lib/types";

import { NonRedelegatableSection } from "./NonRedelegatableSection";

interface RedelegationsSectionProps extends FlexProps {
  isLoading: boolean;
  onBack: () => void;
  redelegations: Redelegation[];
  stakingParams: StakingParams;
}

export const RedelegationsSection = ({
  isLoading,
  onBack,
  redelegations,
  stakingParams,
  ...props
}: RedelegationsSectionProps) => (
  <Flex gap={4} direction="column" {...props}>
    <Flex
      alignItems={{ base: "start", md: "center" }}
      gap={3}
      direction={{ base: "column", md: "row" }}
    >
      <Button
        p={0}
        size={{ base: "xs", md: "md" }}
        variant="ghost-primary"
        onClick={onBack}
      >
        <CustomIcon name="chevron-left" boxSize={6} />
      </Button>
      <TableTitle
        helperText={`Each wallet can redelegate up to ${stakingParams.maxEntries} entries between same pair of validators within last ${stakingParams.unbondingTime} timeframe`}
        mb={0}
        title="Active Redelegations"
        count={redelegations.length}
      />
    </Flex>
    {isLoading ? (
      <Loading withBorder />
    ) : (
      <>
        <NonRedelegatableSection redelegations={redelegations} />
        <RedelegationsTable redelegations={redelegations} />
      </>
    )}
  </Flex>
);
