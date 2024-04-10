import { Box, Flex, Grid, Text } from "@chakra-ui/react";

import { DepositBar } from "../../deposit-bar";
import { DepositList } from "../../DepositList";
import { ErrorFetchingProposalInfos } from "../../ErrorFetchingProposalInfos";
import type { ProposalOverviewProps } from "../../proposal-overview";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { TableTitle } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";
import { extractParams } from "lib/pages/proposal-details/utils";

import { DepositorsTable } from "./depositors-table";

export const DepositPeriodSection = ({
  proposalData,
  params,
  isLoading,
}: ProposalOverviewProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading my={0} />;

  if (!params) return <ErrorFetchingProposalInfos isParamsOnly />;

  const { minDeposit } = extractParams(params, proposalData.isExpedited);

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
            isCompact
          />
          <DepositList proposalDeposits={proposalData.proposalDeposits} />
        </>
      ) : (
        <>
          <Grid templateColumns="1fr 1fr minmax(300px, 3fr)">
            <TableTitle
              title="Depositors"
              mb={0}
              count={proposalData.proposalDeposits.length}
            />
            <Box />
            <Flex>
              <Text
                variant="body2"
                color="text.dark"
                fontWeight={500}
                whiteSpace="nowrap"
                lineHeight={1.8}
                pt={1}
              >
                Total Deposited
                <Tooltip
                  label="After reaching the total deposit amount, the proposal proceeds to the voting period."
                  closeOnClick={false}
                >
                  <CustomIcon
                    name="info-circle-solid"
                    color="gray.600"
                    boxSize={3}
                    mt={0}
                    mb={1}
                  />
                </Tooltip>
              </Text>
              <DepositBar
                deposit={proposalData.totalDeposit}
                minDeposit={minDeposit}
                isCompact={false}
              />
            </Flex>
          </Grid>
          <DepositorsTable depositors={proposalData.proposalDeposits} />
        </>
      )}
    </Flex>
  );
};
