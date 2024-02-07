/* eslint-disable sonarjs/cognitive-complexity */
import { SkeletonText, Text } from "@chakra-ui/react";
import big from "big.js";

import type { ProposalOverviewProps } from "..";
import { ErrorFetching } from "lib/components/state";
import {
  extractParams,
  mapDeposit,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import type { Token, TokenWithValue, U } from "lib/types";
import { ProposalStatus } from "lib/types";
import { formatTokenWithValueList } from "lib/utils";

const Passed = () => (
  <span
    style={{
      color: "var(--chakra-colors-success-main)",
      fontWeight: 700,
    }}
  >
    passed
  </span>
);

const Rejected = () => (
  <span
    style={{
      color: "var(--chakra-colors-error-main)",
      fontWeight: 700,
    }}
  >
    rejected
  </span>
);

export const SummaryStatusBody = ({
  proposalData,
  params,
  votesInfo,
  isLoading,
}: ProposalOverviewProps) => {
  if (isLoading)
    return <SkeletonText mt={1} noOfLines={3} spacing={4} skeletonHeight={2} />;
  if (!params || !votesInfo)
    return <ErrorFetching dataName="proposal params and votes tally" />;

  const { minDeposit, quorum, threshold, vetoThreshold } = extractParams(
    params,
    proposalData.isExpedited
  );
  const { yes, noWithVeto, currentTotalVotes } = normalizeVotesInfo(votesInfo);

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

  if (proposalData.status === ProposalStatus.VOTING_PERIOD) {
    if (currentTotalVotes.lt(quorum))
      return (
        <Text variant="body2">
          As of now, the proposal has not yet reached the required quorum. If
          the voting period concludes without attaining the quorum, the proposal
          will be <Rejected />.
        </Text>
      );

    if (noWithVeto.gte(vetoThreshold))
      return (
        <Text variant="body2">
          The proposal has successfully met the voting quorum. However, if the
          voting period concludes with a{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            &ldquo;No with veto&rdquo; vote surpassing{" "}
            {Math.round(vetoThreshold * 10000) / 100}%
          </span>
          , the proposal will be <Rejected /> regardless of other votes.
        </Text>
      );

    if (currentTotalVotes.eq(0) || yes.div(currentTotalVotes).lt(threshold))
      return (
        <Text variant="body2">
          The proposal has{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            successfully met
          </span>{" "}
          the voting quorum. However, if the current voting tally remains
          unchanged when the voting period ends, the proposal will be{" "}
          <Rejected />.
        </Text>
      );

    return (
      <Text variant="body2">
        The proposal has successfully met the voting quorum. If the current
        voting tally remains unchanged when the voting period ends, the proposal
        will be <Passed />, and its content will be promptly implemented.
      </Text>
    );
  }

  if (proposalData.status === ProposalStatus.FAILED)
    return (
      <Text variant="body2">
        Although the proposal successfully reached the voting quorum with a{" "}
        {yes.mul(100).round(2, big.roundHalfUp).toNumber()}% &ldquo;Yes&rdquo;
        rate, it was not implemented due to technical reasons.
      </Text>
    );

  if (proposalData.status === ProposalStatus.REJECTED) {
    if (currentTotalVotes.lt(quorum))
      return (
        <Text variant="body2">
          This proposal did not meet the required quorum, resulting in its
          rejection regardless of the voting outcomes.
        </Text>
      );

    if (noWithVeto.gte(vetoThreshold))
      return (
        <Text variant="body2">
          This proposal has{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            reached
          </span>{" "}
          the voting quorum. But the voting period ended with &ldquo;No with
          veto&rdquo; more than {Math.round(vetoThreshold * 10000) / 100}%, the
          proposal will be <Rejected /> regardless of other votes.
        </Text>
      );

    return (
      <Text variant="body2">
        The proposal has reached the voting quorum but fell short of reaching
        the &ldquo;Yes&rdquo; votes threshold, resulting in its rejection.
      </Text>
    );
  }

  if (proposalData.status === ProposalStatus.PASSED)
    return (
      <Text variant="body2">
        The proposal has successfully met the voting quorum with a{" "}
        <span
          style={{
            fontWeight: 700,
          }}
        >
          {yes.mul(100).round(2, big.roundHalfUp).toNumber()}% of
          &ldquo;Yes&rdquo;
        </span>{" "}
        rate. As a result, the proposal has been passed, and its content will
        now be implemented.
      </Text>
    );

  if (proposalData.status === ProposalStatus.CANCELLED)
    return (
      <Text variant="body2">
        The proposal was cancelled by the proposer before the governance process
        is complete.
      </Text>
    );

  return (
    <Text variant="body2">
      The voting for this proposal did not reach the required quorum. As a
      result, the proposal is not considered valid and rejected.
    </Text>
  );
};
