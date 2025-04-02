import type { FlexProps } from "@chakra-ui/react";
import type { Redelegation, StakingParams } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";

import { RedelegationsTable, TableTitle } from "../table";
import { NonRedelegatableSection } from "./NonRedelegatableSection";

interface RedelegationsSectionProps extends FlexProps {
  stakingParams: StakingParams;
  redelegations: Redelegation[];
  isLoading: boolean;
  onBack: () => void;
}

export const RedelegationsSection = ({
  stakingParams,
  redelegations,
  isLoading,
  onBack,
  ...props
}: RedelegationsSectionProps) => (
  <Flex direction="column" gap={4} {...props}>
    <Flex
      alignItems={{ base: "start", md: "center" }}
      direction={{ base: "column", md: "row" }}
      gap={3}
    >
      <Button
        p={0}
        size={{ base: "xs", md: "md" }}
        variant="ghost-primary"
        onClick={onBack}
      >
        <CustomIcon boxSize={6} name="chevron-left" />
      </Button>
      <TableTitle
        count={redelegations.length}
        helperText={`Each wallet can redelegate up to ${stakingParams.maxEntries} entries between same pair of validators within last ${stakingParams.unbondingTime} timeframe`}
        mb={0}
        title="Active Redelegations"
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
