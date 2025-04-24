import type Big from "big.js";
import type { AssetInfos, Option, ValidatorAddr } from "lib/types";

import { Alert, AlertDescription, Flex } from "@chakra-ui/react";
import { useMobile, useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

import { VotingPowerChart } from "../bonded-token-changes/VotingPowerChart";
import { Performance } from "../performance";
import { RecentBlocksSection } from "../performance/RecentBlocksSection";
import { ProposedBlocksTable } from "../tables/ProposedBlocksTable";
import { VotedProposalsTable } from "../tables/voted-proposals";
import { ValidatorDescription } from "./ValidatorDescription";
import { VotingPowerOverview } from "./VotingPowerOverview";

interface ValidatorOverviewProps {
  assetInfos: Option<AssetInfos>;
  details: string;
  isActive: boolean;
  isJailed: boolean;
  onSelectBondedTokenChanges: Option<() => void>;
  onSelectPerformance: Option<() => void>;
  onSelectVotes: Option<() => void>;
  selfVotingPower: Big;
  singleStakingDenom: Option<string>;
  totalVotingPower: Big;
  validatorAddress: ValidatorAddr;
  votingPower: Big;
}

export const ValidatorOverview = ({
  assetInfos,
  details,
  isActive,
  isJailed,
  onSelectBondedTokenChanges,
  onSelectPerformance,
  onSelectVotes,
  selfVotingPower,
  singleStakingDenom,
  totalVotingPower,
  validatorAddress,
  votingPower,
}: ValidatorOverviewProps) => {
  const { isFullTier } = useTierConfig();
  const isMobile = useMobile();

  return (
    <Flex direction="column" gap={{ base: 4, md: 6 }} pt={6}>
      {(!isActive || isJailed) && (
        <Alert gap={2} my={6} variant="error">
          <CustomIcon
            boxSize={4}
            color="error.main"
            name="alert-triangle-solid"
          />
          <AlertDescription>
            This validator is currently {isJailed ? "jailed" : "inactive"}. The
            information displayed reflects the latest available data.
          </AlertDescription>
        </Alert>
      )}
      <ValidatorDescription details={details} />
      {isFullTier ? (
        <>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 6 }}
          >
            <VotingPowerOverview
              assetInfos={assetInfos}
              selfVotingPower={selfVotingPower}
              singleStakingDenom={singleStakingDenom}
              totalVotingPower={totalVotingPower}
              votingPower={votingPower}
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
            assetInfos={assetInfos}
            singleStakingDenom={singleStakingDenom}
            validatorAddress={validatorAddress}
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
        </>
      ) : (
        <VotingPowerOverview
          assetInfos={assetInfos}
          selfVotingPower={selfVotingPower}
          singleStakingDenom={singleStakingDenom}
          totalVotingPower={totalVotingPower}
          votingPower={votingPower}
        />
      )}
    </Flex>
  );
};
