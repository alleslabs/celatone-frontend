import { Alert, AlertDescription, Flex } from "@chakra-ui/react";
import type Big from "big.js";

import { VotingPowerChart } from "../bonded-token-changes/VotingPowerChart";
import { Performance } from "../performance";
import { RecentBlocksSection } from "../performance/RecentBlocksSection";
import { ProposedBlocksTable } from "../tables/ProposedBlocksTable";
import { VotedProposalsTable } from "../tables/voted-proposals";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, ValidatorAddr } from "lib/types";

import { ValidatorDescription } from "./ValidatorDescription";
import { VotingPowerOverview } from "./VotingPowerOverview";

interface ValidatorOverviewProps {
  onSelectVotes: () => void;
  onSelectPerformance: () => void;
  onSelectBondedTokenChanges: () => void;
  isActive: boolean;
  isJailed: boolean;
  details: string;
  validatorAddress: ValidatorAddr;
  singleStakingDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
  votingPower: Big;
  totalVotingPower: Big;
  selfVotingPower: Big;
}

export const ValidatorOverview = ({
  onSelectVotes,
  onSelectPerformance,
  onSelectBondedTokenChanges,
  isActive,
  isJailed,
  details,
  validatorAddress,
  singleStakingDenom,
  assetInfos,
  votingPower,
  totalVotingPower,
  selfVotingPower,
}: ValidatorOverviewProps) => {
  const isMobile = useMobile();

  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
      {(!isActive || isJailed) && (
        <Alert variant="error" gap={2} my={6}>
          <CustomIcon
            name="alert-circle-solid"
            boxSize={4}
            color="error.main"
          />
          <AlertDescription>
            This validator is currently {isJailed ? "jailed" : "inactive"}. The
            information displayed reflects the latest available data.
          </AlertDescription>
        </Alert>
      )}
      <ValidatorDescription details={details} />
      <Flex gap={{ base: 4, md: 6 }} direction={{ base: "column", md: "row" }}>
        <VotingPowerOverview
          singleStakingDenom={singleStakingDenom}
          assetInfos={assetInfos}
          votingPower={votingPower}
          totalVotingPower={totalVotingPower}
          selfVotingPower={selfVotingPower}
        />
        <Performance
          validatorAddress={validatorAddress}
          onViewMore={onSelectPerformance}
        />
      </Flex>
      {!isMobile && (
        <Flex backgroundColor="gray.900" p={6} rounded={8} w="100%">
          <RecentBlocksSection validatorAddress={validatorAddress} />
        </Flex>
      )}
      <VotingPowerChart
        validatorAddress={validatorAddress}
        singleStakingDenom={singleStakingDenom}
        assetInfos={assetInfos}
        onViewMore={onSelectBondedTokenChanges}
      />
      <ProposedBlocksTable
        validatorAddress={validatorAddress}
        onViewMore={onSelectPerformance}
      />
      <VotedProposalsTable
        validatorAddress={validatorAddress}
        onViewMore={onSelectVotes}
      />
    </Flex>
  );
};
