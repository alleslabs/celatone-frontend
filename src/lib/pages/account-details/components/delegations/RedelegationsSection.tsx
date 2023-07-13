import type { FlexProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";

import { RedelegationsTable } from "../tables";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TableTitle } from "lib/components/table";
import type {
  Redelegation,
  StakingParams,
} from "lib/pages/account-details/data";

import { NonRedelegatableSection } from "./NonRedelegatableSection";
import { RedelegationsMobile } from "./RedelegationsMobile";

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
}: RedelegationsSectionProps) => {
  const isMobile = useMobile();
  return (
    <Flex direction="column" gap={4} {...props}>
      <Flex
        gap={3}
        alignItems={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
      >
        <Button
          variant="ghost-secondary"
          size={{ base: "xs", md: "md" }}
          p={0}
          onClick={onBack}
        >
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
          {isMobile ? (
            <RedelegationsMobile redelegations={redelegations} />
          ) : (
            <RedelegationsTable redelegations={redelegations} />
          )}
        </>
      )}
    </Flex>
  );
};
