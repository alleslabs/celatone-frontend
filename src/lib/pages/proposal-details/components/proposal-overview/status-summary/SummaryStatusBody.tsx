import { Text } from "@chakra-ui/react";
import type Big from "big.js";

import type { ProposalOverviewProps } from "..";
import { ErrorFetching } from "lib/components/state";
import { extractParams, mapDeposit } from "lib/pages/proposal-details/utils";
import type { Token, TokenWithValue, U } from "lib/types";
import { ProposalStatus } from "lib/types";
import { formatTokenWithValueList } from "lib/utils";

export const SummaryStatusBody = ({
  proposalData,
  params,
  votesInfo,
}: ProposalOverviewProps) => {
  if (!params || !votesInfo)
    return <ErrorFetching dataName="proposal params and votes tally." />;

  const { minDeposit } = extractParams(params, proposalData.isExpedited);

  if (proposalData.status === ProposalStatus.DEPOSIT_PERIOD) {
    const required = mapDeposit(proposalData.totalDeposit, minDeposit).reduce<
      TokenWithValue[]
    >((prev, pair) => {
      if (pair.current.amount.lt(pair.min.amount))
        prev.push({
          ...pair.min,
          amount: pair.min.amount.sub(pair.current.amount) as U<Token<Big>>,
        });
      return prev;
    }, []);

    return (
      <Text variant="body2">
        The proposal is currently in the deposit period and requires an
        additional deposit of {formatTokenWithValueList(required)} to advance to
        the voting period. Failure to make the required deposit will result in
        the rejection of the proposal.
      </Text>
    );
  }

  return <Text variant="body2">Detail</Text>;
};
