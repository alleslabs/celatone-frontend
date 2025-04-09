import type { FlexProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import type { Redelegation, StakingParams } from "lib/types";

import { NonRedelegatableSection } from "./NonRedelegatableSection";
import { RedelegationsTable, TableTitle } from "../table";

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
      gap={3}
      alignItems={{ base: "start", md: "center" }}
      direction={{ base: "column", md: "row" }}
    >
      <Button
        variant="ghost-primary"
        size={{ base: "xs", md: "md" }}
        p={0}
        onClick={onBack}
      >
        <CustomIcon name="chevron-left" boxSize={6} />
      </Button>
      <TableTitle
        title="Active redelegations"
        count={redelegations.length}
        helperText={`Each wallet can redelegate up to ${stakingParams.maxEntries} entries between same pair of validators within last ${stakingParams.unbondingTime} timeframe`}
        mb={0}
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
