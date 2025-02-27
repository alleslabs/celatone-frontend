import { Flex, Grid, Text } from "@chakra-ui/react";

import { useMobile, useTierConfig } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { TableTitle } from "lib/components/table";
import { TooltipInfo } from "lib/components/Tooltip";
import { extractParams } from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";

import { DepositorsTable } from "./depositors-table";
import { DepositBar } from "../../deposit-bar";
import { DepositList } from "../../DepositList";
import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import type { ProposalOverviewProps } from "../../proposal-overview";

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
      direction="column"
      background={isMobile ? "transparent" : "gray.900"}
      border={isMobile ? undefined : "1px solid var(--chakra-colors-gray-700)"}
      borderRadius="8px"
      p={isMobile ? 0 : 6}
      gap={4}
    >
      {isMobile ? (
        <>
          <DepositBar
            deposit={proposalData.totalDeposit}
            minDeposit={minDeposit}
            isDepositOrVoting={isDepositOrVoting}
            isCompact
          />
          <DepositList
            proposalDeposits={proposalData.proposalDeposits}
            isDepositsLoading={isDepositsLoading}
          />
        </>
      ) : (
        <>
          <Grid templateColumns="2fr minmax(300px, 3fr)">
            <TableTitle
              title="Depositors"
              mb={0}
              count={proposalData.proposalDeposits.length}
              showCount={isFullTier || isDepositOrVoting}
            />
            <Flex
              gap={1}
              align="center"
              marginLeft={isDepositOrVoting ? 0 : "auto"}
            >
              <Text
                variant="body2"
                color="text.dark"
                fontWeight={500}
                whiteSpace="nowrap"
                lineHeight={1.8}
              >
                Total Deposited
              </Text>
              <TooltipInfo
                label="After reaching the total deposit amount, the proposal proceeds to the voting period."
                h="full"
              />
              <DepositBar
                deposit={proposalData.totalDeposit}
                minDeposit={minDeposit}
                isDepositOrVoting={isDepositOrVoting}
                isCompact={false}
              />
            </Flex>
          </Grid>
          <DepositorsTable
            depositors={proposalData.proposalDeposits}
            isDepositsLoading={isDepositsLoading}
            showTransaction={isFullTier}
            isPruned={!isFullTier && !isDepositOrVoting}
          />
        </>
      )}
    </Flex>
  );
};
