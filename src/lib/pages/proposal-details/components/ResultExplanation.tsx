import type {
  Option,
  ProposalData,
  ProposalParams,
  ProposalVotesInfo,
  Token,
  TokenWithValue,
  U,
} from "lib/types";

import { SkeletonText, Text } from "@chakra-ui/react";
import { useGovConfig } from "lib/app-provider";
import {
  extractParams,
  mapDeposit,
  normalizeVotesInfo,
} from "lib/pages/proposal-details/utils";
import { ProposalStatus } from "lib/types";
import { formatPrettyPercent, formatTokenWithValueList } from "lib/utils";
import { isNull } from "lodash";

import { ErrorFetchingProposalInfos } from "./ErrorFetchingProposalInfos";
import { NoVotingPeriodTallyExplanation } from "./NoVotingPeriodTally";
import { ViewFailedReason } from "./ViewFailedReason";

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

const QuorumRejected = () => (
  <Text variant="body2">
    This proposal{" "}
    <span
      style={{
        color: "var(--chakra-colors-error-main)",
        fontWeight: 700,
      }}
    >
      did not meet the required quorum
    </span>
    , resulting in its rejection regardless of the voting outcomes.
  </Text>
);

export interface ResultExplanationProps {
  isLoading: boolean;
  params: Option<ProposalParams>;
  proposalData: ProposalData;
  votesInfo: Option<ProposalVotesInfo>;
}

export const ResultExplanation = ({
  isLoading,
  params,
  proposalData,
  votesInfo,
}: ResultExplanationProps) => {
  const gov = useGovConfig({ shouldRedirect: false });
  if (
    gov.enabled &&
    gov.disableVotingPeriodTally &&
    proposalData.status === ProposalStatus.VOTING_PERIOD
  )
    return (
      <Text variant="body2">
        <NoVotingPeriodTallyExplanation />
      </Text>
    );

  if (proposalData.status === ProposalStatus.DEPOSIT_FAILED)
    return (
      <Text variant="body2">
        The proposal has not received the necessary deposits to advance to the
        voting period.
      </Text>
    );

  if (proposalData.status === ProposalStatus.CANCELLED)
    return (
      <Text variant="body2">
        The proposal was cancelled by the proposer before the governance process
        is complete.
      </Text>
    );

  if (isLoading)
    return <SkeletonText mt={1} noOfLines={3} skeletonHeight={2} spacing={4} />;
  if (!params || !votesInfo) return <ErrorFetchingProposalInfos />;

  const { minDeposit, quorum, threshold, vetoThreshold } = extractParams(
    params,
    proposalData.isExpedited
  );
  const { noWithVetoTotalRatio, totalRatio, yesNonRatio } =
    normalizeVotesInfo(votesInfo);

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
    if (isNull(totalRatio)) return <ErrorFetchingProposalInfos />;
    if (totalRatio < quorum)
      return (
        <Text variant="body2">
          As of now, the proposal has not yet reached the required quorum. If
          the voting period concludes without attaining the quorum, the proposal
          will be <Rejected />.
        </Text>
      );
    if (noWithVetoTotalRatio >= vetoThreshold)
      return (
        <Text variant="body2">
          The proposal has met the voting quorum, but &ldquo;No with veto&rdquo;
          vote currently constitutes{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {formatPrettyPercent(noWithVetoTotalRatio)}
          </span>{" "}
          of the total votes, including{" "}
          <span
            style={{
              color: "var(--chakra-colors-gray-500)",
            }}
          >
            Abstain
            <br />
            (this may differ from the value shown on the bar, which excludes{" "}
            <span style={{ fontWeight: 700 }}>Abstain</span>)
          </span>
          <br />
          <br />
          Since the veto threshold of {formatPrettyPercent(vetoThreshold)} has
          been exceeded, the proposal will be <Rejected />, regardless of the
          number of &ldquo;Yes&rdquo; votes, if this outcome holds.
        </Text>
      );

    if (yesNonRatio < threshold)
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
        {formatPrettyPercent(yesNonRatio)} &ldquo;Yes&rdquo; rate, it was not
        implemented due to technical reasons.{" "}
        <ViewFailedReason text={proposalData.failedReason} />
      </Text>
    );

  if (proposalData.status === ProposalStatus.REJECTED) {
    if (!isNull(totalRatio)) {
      if (totalRatio < quorum) return <QuorumRejected />;

      if (noWithVetoTotalRatio >= vetoThreshold)
        return (
          <Text variant="body2">
            Due to the &ldquo;No with veto&rdquo; vote proportion constitutes{" "}
            <span
              style={{
                fontWeight: 700,
              }}
            >
              {formatPrettyPercent(noWithVetoTotalRatio)}{" "}
            </span>
            of the total votes including &ldquo;Abstain&rdquo;, which exceeds
            the{" "}
            <span
              style={{
                fontWeight: 700,
              }}
            >
              {formatPrettyPercent(vetoThreshold)} threshold
            </span>
            , the proposal is <Rejected /> regardless of &ldquo;Yes&rdquo;
            votes.
          </Text>
        );

      return (
        <Text variant="body2">
          The proposal has reached the voting quorum but fell short of reaching
          the &ldquo;Yes&rdquo; votes threshold, so the proposal is <Rejected />
          .
        </Text>
      );
    }

    if (yesNonRatio >= threshold) return <QuorumRejected />;

    if (noWithVetoTotalRatio >= vetoThreshold)
      return (
        <Text variant="body2">
          The proposal is <Rejected /> due to either the quorum is not reached
          or the &ldquo;No with veto&rdquo; vote proportion constitutes{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {formatPrettyPercent(noWithVetoTotalRatio)}{" "}
          </span>
          of the total votes including &ldquo;Abstain&rdquo;, which exceeds the{" "}
          <span
            style={{
              fontWeight: 700,
            }}
          >
            {formatPrettyPercent(vetoThreshold)} threshold
          </span>
          .
        </Text>
      );

    return (
      <Text variant="body2">
        The proposal is <Rejected /> due to either the quorum is not reached or
        fell short of reaching the &ldquo;Yes&rdquo; votes threshold.
      </Text>
    );
  }

  return (
    <Text variant="body2">
      The proposal has successfully met the voting quorum with a{" "}
      <span
        style={{
          fontWeight: 700,
        }}
      >
        {formatPrettyPercent(yesNonRatio)} of &ldquo;Yes&rdquo;
      </span>{" "}
      rate. As a result, the proposal has been passed, and its content will now
      be implemented.
    </Text>
  );
};
