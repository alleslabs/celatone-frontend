import type { Nullable, Ratio } from "lib/types";

import { Circle, Heading, Text } from "@chakra-ui/react";
import { formatPrettyPercent } from "lib/utils";
import { isNull } from "lodash";

interface VoteQuorumCircleProps {
  quorum: Ratio<number>;
  nonAbstainRatio: Nullable<Ratio<number>>;
  totalRatio: Nullable<Ratio<number>>;
  isCompact: boolean;
  isBgGray?: boolean;
}

export const VoteQuorumCircle = ({
  isBgGray,
  isCompact,
  nonAbstainRatio,
  quorum,
  totalRatio,
}: VoteQuorumCircleProps) => {
  const nonAbstainAngle = (nonAbstainRatio ?? 0) * 360;
  const totalAngle = (totalRatio ?? 0) * 360;
  const quorumAngle = quorum * 360;
  const quorumPercent = formatPrettyPercent(quorum);

  return (
    <Circle
      bgGradient={`conic(voteParticipations.voted ${nonAbstainAngle}deg, voteParticipations.votedAbstain ${nonAbstainAngle}deg ${totalAngle}deg, voteParticipations.didNotVote ${totalAngle}deg)`}
      position="relative"
      size={isCompact ? "64px" : "160px"}
    >
      <Circle
        bgGradient="conic(white 2deg, transparent 2deg 358deg, white 358deg)"
        size={isCompact ? "64px" : "160px"}
        transform={`rotate(${quorumAngle}deg)`}
      >
        {!isCompact && (
          <Text
            textAlign="left"
            transform={`translate(0, -${500 + (90 - Math.abs(90 - (quorumAngle % 180))) / (3 - quorumPercent.length / 3)}%) rotate(${-quorumAngle}deg)`}
            variant="body3"
          >
            {quorumPercent}
          </Text>
        )}
      </Circle>
      <Circle
        bgColor={isBgGray ? "gray.900" : "background.main"}
        position="absolute"
        size={isCompact ? "52px" : "134px"}
      >
        {!isCompact && (
          <Text
            color="text.dark"
            position="absolute"
            top="22.5%"
            variant="body3"
          >
            Voted
          </Text>
        )}
        <Heading
          color={totalRatio ? "text.main" : "text.dark"}
          fontWeight={600}
          variant={isCompact ? "h7" : "h4"}
        >
          {!isNull(totalRatio) ? formatPrettyPercent(totalRatio, 1) : "N/A"}
        </Heading>
      </Circle>
    </Circle>
  );
};
