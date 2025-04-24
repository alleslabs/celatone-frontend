import type { Nullable, Ratio } from "lib/types";

import { Text } from "@chakra-ui/react";
import { ProposalStatus } from "lib/types";
import { formatPrettyPercent } from "lib/utils";
import { isNull } from "lodash";

interface VoteQuorumTextProps {
  isCompact: boolean;
  quorum: Ratio<number>;
  status: ProposalStatus;
  totalRatio: Nullable<Ratio<number>>;
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

export const VoteQuorumText = ({
  isCompact,
  quorum,
  status,
  totalRatio,
}: VoteQuorumTextProps) => {
  const fontVariant = isCompact ? "body2" : "body1";
  if (isNull(totalRatio))
    return (
      <Text variant={fontVariant}>
        Quorum information cannot be retrieved, due to the completion proposal
        being concluded a considerable time ago.
      </Text>
    );

  const quorumPercent = formatPrettyPercent(quorum);
  const isPassingQuorum = totalRatio >= quorum;

  if (status === ProposalStatus.VOTING_PERIOD)
    return isPassingQuorum ? (
      <Text color="text.main" variant={fontVariant}>
        The proposal has successfully met the voting{" "}
        <span style={{ fontWeight: 700 }}>{quorumPercent}</span> quorum and will
        be <Established /> after the voting period ends.
      </Text>
    ) : (
      <Text color="text.main" variant={fontVariant}>
        The proposal required{" "}
        <span style={{ fontWeight: 700 }}>{quorumPercent}</span> vote quorum to
        establish.
      </Text>
    );

  return isPassingQuorum ? (
    <Text color="text.main" variant={fontVariant}>
      The proposal has successfully met the voting{" "}
      <span style={{ fontWeight: 700 }}>{quorumPercent}</span> quorum and{" "}
      <Established />.
    </Text>
  ) : (
    <Text color="text.main" variant={fontVariant}>
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
