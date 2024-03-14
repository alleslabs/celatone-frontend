import { Alert, AlertDescription, Flex } from "@chakra-ui/react";

import { BondedTokenChangeMobileCard } from "../bonded-token-changes/BondedTokenChangeMobileCard";
import { VotingPowerChart } from "../bonded-token-changes/VotingPowerChart";
import { RecentBlocksSection } from "../performance/RecentBlocksSection";
import { UptimeSection } from "../performance/UptimeSection";
import { ProposedBlocksTable } from "../tables/ProposedBlocksTable";
import { VotedProposalsTable } from "../tables/VotedProposalsTable";
import { useMobile, useMoveConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { EmptyState } from "lib/components/state";
import type { ValidatorAddr } from "lib/types";

import { ValidatorDescription } from "./ValidatorDescription";
import { VotingPowerOverview } from "./VotingPowerOverview";

interface ValidatorOverviewProps {
  onSelectVotes: () => void;
  onSelectPerformance: () => void;
  onSelectBondedTokenChanges: () => void;
  validatorAddress: ValidatorAddr;
}

export const ValidatorOverview = ({
  onSelectVotes,
  onSelectPerformance,
  onSelectBondedTokenChanges,
  validatorAddress,
}: ValidatorOverviewProps) => {
  const isMobile = useMobile();
  const move = useMoveConfig({ shouldRedirect: false });

  return (
    <>
      <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
        <ValidatorDescription />
        <Flex
          gap={{ base: 4, md: 6 }}
          direction={{ base: "column", md: "row" }}
        >
          <VotingPowerOverview />
          <UptimeSection onViewMore={onSelectPerformance} />
        </Flex>
        {!isMobile && (
          <>
            <Flex backgroundColor="gray.900" p={6} rounded={8} w="100%">
              <RecentBlocksSection hasTitle />
            </Flex>
            {!move.enabled && (
              <VotingPowerChart validatorAddress={validatorAddress} />
            )}
          </>
        )}
        {isMobile && !move.enabled && (
          <BondedTokenChangeMobileCard
            denom="OSMO"
            onViewMore={onSelectBondedTokenChanges}
          />
        )}
        <ProposedBlocksTable
          validatorAddress={validatorAddress}
          onViewMore={onSelectPerformance}
        />
        <VotedProposalsTable onViewMore={onSelectVotes} />
      </Flex>
      {/* TODO: change to conditions and remove line 72-74 */}
      {/* Inactive */}
      <Flex bg="teal.400" my={6}>
        INACTIVE
      </Flex>
      <Alert variant="error" gap={2} my={6}>
        <CustomIcon name="alert-circle-solid" boxSize={4} color="error.main" />
        <AlertDescription>
          This validator is currently inactive. The information displayed
          reflects the latest available data.
        </AlertDescription>
      </Alert>
      <ValidatorDescription />
      <EmptyState
        message="This validator has recently begun their duties. Let's extend our best wishes for their success in their role. 😊"
        imageVariant="empty"
        withBorder
      />
    </>
  );
};
