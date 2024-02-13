import { Text } from "@chakra-ui/react";

import { ProposalStatus } from "lib/types";
import { formatPrettyPercent } from "lib/utils";

interface VotingOverviewQuorumTextProps {
  status: ProposalStatus;
  quorum: number;
  totalVotes: Big;
}

const Established = () => (
  <span
    style={{
      color: "var(--chakra-colors-success-main)",
      fontWeight: 700,
    }}
  >
    established
  </span>
);

export const VotingOverviewQuorumText = ({
  status,
  quorum,
  totalVotes,
}: VotingOverviewQuorumTextProps) => {
  const quorumPercent = formatPrettyPercent(quorum);
  const isPassingQuorum = totalVotes.gte(quorum);

  if (status === ProposalStatus.VOTING_PERIOD)
    return isPassingQuorum ? (
      <Text variant="body2" color="text.main">
        The proposal has successfully met the voting{" "}
        <span style={{ fontWeight: 700 }}>{quorumPercent}</span> quorum and will
        be <Established /> after the voting period ends.
      </Text>
    ) : (
      <Text variant="body2" color="text.main">
        The proposal required{" "}
        <span style={{ fontWeight: 700 }}>{quorumPercent}</span> vote quorum to
        establish.
      </Text>
    );

  return isPassingQuorum ? (
    <Text variant="body2" color="text.main">
      The proposal has successfully met the voting{" "}
      <span style={{ fontWeight: 700 }}>{quorumPercent}</span> quorum and{" "}
      <Established />.
    </Text>
  ) : (
    <Text variant="body2" color="text.main">
      This proposal{" "}
      <span
        style={{
          color: "var(--chakra-colors-error-main)",
          fontWeight: 700,
        }}
      >
        did not meet the required {quorumPercent} quorum
      </span>
      , resulting in its rejection regardless of the voting outcomes.
    </Text>
  );
};
