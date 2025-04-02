import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMobile, useTierConfig } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { TableTitle } from "lib/components/table";
import { TooltipInfo } from "lib/components/Tooltip";
import { extractParams } from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";

import type { ProposalOverviewProps } from "../../proposal-overview";

import { DepositBar } from "../../deposit-bar";
import { DepositList } from "../../DepositList";
import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import { DepositorsTable } from "./depositors-table";

export const DepositPeriodSection = ({
  proposalData,
  params,
  isLoading,
  isDepositsLoading,
}: ProposalOverviewProps) => {
  const { isFullTier } = useTierConfig();
  const isMobile = useMobile();

  if (isLoading) return <Loading my={0} />;
  if (!params) return <ErrorFetchingProposalInfos isParamsOnly />;

  const { minDeposit } = extractParams(params, proposalData.isExpedited);
  const isDepositOrVoting =
    proposalData.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposalData.status === ProposalStatus.VOTING_PERIOD;
  return (
    <Flex
      background={isMobile ? "transparent" : "gray.900"}
      border={isMobile ? undefined : "1px solid var(--chakra-colors-gray-700)"}
      borderRadius="8px"
      direction="column"
      gap={4}
      p={isMobile ? 0 : 6}
    >
      {isMobile ? (
        <>
          <DepositBar
            deposit={proposalData.totalDeposit}
            isCompact
            isDepositOrVoting={isDepositOrVoting}
            minDeposit={minDeposit}
          />
          <DepositList
            isDepositsLoading={isDepositsLoading}
            proposalDeposits={proposalData.proposalDeposits}
          />
        </>
      ) : (
        <>
          <Grid templateColumns="2fr minmax(300px, 3fr)">
            <TableTitle
              count={proposalData.proposalDeposits.length}
              mb={0}
              showCount={isFullTier || isDepositOrVoting}
              title="Depositors"
            />
            <Flex
              align="center"
              gap={1}
              marginLeft={isDepositOrVoting ? 0 : "auto"}
            >
              <Text
                color="text.dark"
                fontWeight={500}
                lineHeight={1.8}
                variant="body2"
                whiteSpace="nowrap"
              >
                Total Deposited
              </Text>
              <TooltipInfo
                h="full"
                label="After reaching the total deposit amount, the proposal proceeds to the voting period."
              />
              <DepositBar
                deposit={proposalData.totalDeposit}
                isCompact={false}
                isDepositOrVoting={isDepositOrVoting}
                minDeposit={minDeposit}
              />
            </Flex>
          </Grid>
          <DepositorsTable
            depositors={proposalData.proposalDeposits}
            isDepositsLoading={isDepositsLoading}
            isPruned={!isFullTier && !isDepositOrVoting}
            showTransaction={isFullTier}
          />
        </>
      )}
    </Flex>
  );
};
