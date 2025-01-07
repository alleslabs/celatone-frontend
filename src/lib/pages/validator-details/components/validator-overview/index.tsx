import { Alert, AlertDescription, Flex } from "@chakra-ui/react";
import type Big from "big.js";

import { VotingPowerChart } from "../bonded-token-changes/VotingPowerChart";
import { Performance } from "../performance";
import { RecentBlocksSection } from "../performance/RecentBlocksSection";
import { ProposedBlocksTable } from "../tables/ProposedBlocksTable";
import { VotedProposalsTable } from "../tables/voted-proposals";
import { useMobile, useTierConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { AssetInfos, Option, ValidatorAddr } from "lib/types";

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
    <Flex gap={{ base: 4, md: 6 }} pt={6} direction="column">
      {(!isActive || isJailed) && (
        <Alert gap={2} my={6} variant="error">
          <CustomIcon
            name="alert-triangle-solid"
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
      {isFullTier ? (
        <>
          <Flex
            gap={{ base: 4, md: 6 }}
            direction={{ base: "column", md: "row" }}
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
            <Flex p={6} w="100%" backgroundColor="gray.900" rounded={8}>
              <RecentBlocksSection validatorAddress={validatorAddress} />
            </Flex>
          )}
          <VotingPowerChart
            validatorAddress={validatorAddress}
            assetInfos={assetInfos}
            onViewMore={onSelectBondedTokenChanges}
            singleStakingDenom={singleStakingDenom}
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
