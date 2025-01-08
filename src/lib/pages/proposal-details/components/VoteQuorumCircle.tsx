import { Circle, Heading, Text } from "@chakra-ui/react";
import { isNull } from "lodash";

import type { Nullable, Ratio } from "lib/types";
import { formatPrettyPercent } from "lib/utils";

interface VoteQuorumCircleProps {
  isBgGray?: boolean;
  isCompact: boolean;
  nonAbstainRatio: Nullable<Ratio<number>>;
  quorum: Ratio<number>;
  totalRatio: Nullable<Ratio<number>>;
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
      size={isCompact ? "64px" : "160px"}
      position="relative"
    >
      <Circle
        bgGradient="conic(white 2deg, transparent 2deg 358deg, white 358deg)"
        size={isCompact ? "64px" : "160px"}
        transform={`rotate(${quorumAngle}deg)`}
      >
        {!isCompact && (
          <Text
            textAlign="left"
            variant="body3"
            transform={`translate(0, -${500 + (90 - Math.abs(90 - (quorumAngle % 180))) / (3 - quorumPercent.length / 3)}%) rotate(${-quorumAngle}deg)`}
          >
            {quorumPercent}
          </Text>
        )}
      </Circle>
      <Circle
        size={isCompact ? "52px" : "134px"}
        bgColor={isBgGray ? "gray.900" : "background.main"}
        position="absolute"
      >
        {!isCompact && (
          <Text
            variant="body3"
            color="text.dark"
            position="absolute"
            top="22.5%"
          >
            Voted
          </Text>
        )}
        <Heading
          variant={isCompact ? "h7" : "h4"}
          color={totalRatio ? "text.main" : "text.dark"}
          fontWeight={600}
        >
          {!isNull(totalRatio) ? formatPrettyPercent(totalRatio, 1) : "N/A"}
        </Heading>
      </Circle>
    </Circle>
  );
};
