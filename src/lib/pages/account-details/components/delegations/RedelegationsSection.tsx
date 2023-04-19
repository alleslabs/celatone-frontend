import type { FlexProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";

import { RedelegationsTable } from "../tables";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TableTitle } from "lib/components/table";
import type {
  Redelegation,
  StakingParams,
} from "lib/pages/account-details/data";

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
    <Flex gap={3} alignItems="center">
      <Button variant="ghost-primary" p={0} onClick={onBack}>
        <CustomIcon name="chevron-left" boxSize={6} />
      </Button>
      <TableTitle
        title="Active Redelegations"
        count={redelegations.length}
        helperText={`Each wallet can redelegate up to ${stakingParams.maxEntries} entries between same pair of validators within last ${stakingParams.unbondingTime} timeframe`}
        mb={0}
      />
    </Flex>
    {isLoading ? (
      <Loading />
    ) : (
      <>
        <NonRedelegatableSection redelegations={redelegations} />
        <RedelegationsTable redelegations={redelegations} />
      </>
    )}
  </Flex>
);
