import { Circle, Heading, Text } from "@chakra-ui/react";

import type { Nullable, Ratio } from "lib/types";
import { formatPrettyPercent } from "lib/utils";

interface VoteQuorumCircleProps {
  quorum: Ratio<number>;
  nonAbstainRatio: Nullable<Ratio<number>>;
  totalRatio: Nullable<Ratio<number>>;
  isCompact: boolean;
  isBgGray?: boolean;
}

export const VoteQuorumCircle = ({
  quorum,
  nonAbstainRatio,
  totalRatio,
  isCompact,
  isBgGray,
}: VoteQuorumCircleProps) => {
  const nonAbstainAngle = (nonAbstainRatio ?? 0) * 360;
  const totalAngle = (totalRatio ?? 0) * 360;
  const quorumAngle = quorum * 360;
  const quorumPercent = formatPrettyPercent(quorum);

  return (
    <Circle
      size={isCompact ? "64px" : "160px"}
      position="relative"
      bgGradient={`conic(voteParticipations.voted ${nonAbstainAngle}deg, voteParticipations.votedAbstain ${nonAbstainAngle}deg ${totalAngle}deg, voteParticipations.didNotVote ${totalAngle}deg)`}
    >
      <Circle
        size={isCompact ? "64px" : "160px"}
        bgGradient="conic(white 2deg, transparent 2deg 358deg, white 358deg)"
        transform={`rotate(${quorumAngle}deg)`}
      >
        {!isCompact && (
          <Text
            transform={`translate(0, -${500 + (90 - Math.abs(90 - (quorumAngle % 180))) / (3 - quorumPercent.length / 3)}%) rotate(${-quorumAngle}deg)`}
            variant="body3"
            textAlign="left"
          >
            {quorumPercent}
          </Text>
        )}
      </Circle>
      <Circle
        size={isCompact ? "52px" : "134px"}
        position="absolute"
        bgColor={isBgGray ? "gray.900" : "background.main"}
      >
        {!isCompact && (
          <Text
            position="absolute"
            top="22.5%"
            variant="body3"
            color="text.dark"
          >
            Voted
          </Text>
        )}
        <Heading
          variant={isCompact ? "h7" : "h4"}
          fontWeight={600}
          color={totalRatio ? "text.main" : "text.dark"}
        >
          {totalRatio ? formatPrettyPercent(totalRatio, 1) : "N/A"}
        </Heading>
      </Circle>
    </Circle>
  );
};
