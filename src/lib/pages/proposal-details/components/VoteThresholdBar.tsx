import { Flex, Text } from "@chakra-ui/react";

import { normalizeVotesInfo } from "../utils";
import type { ProposalVotesInfo, Ratio } from "lib/types";
import { formatPrettyPercent } from "lib/utils";

interface BarSectionProps {
  percent: string;
  color: string;
  option: string;
  textColor: string;
  isCompact: boolean;
}

const BarSection = ({
  percent,
  color,
  option,
  textColor,
  isCompact,
}: BarSectionProps) => (
  <Flex
    minW={percent}
    maxW={percent}
    bgColor={color}
    overflow="hidden"
    whiteSpace="nowrap"
    alignItems="center"
    gap={2}
  >
    {!isCompact && (
      <>
        <Text variant="body2" fontWeight={700} color={textColor} ml={2}>
          {percent}
        </Text>
        <Text variant="body2" color={textColor}>
          {option}
        </Text>
      </>
    )}
  </Flex>
);

interface VoteThresholdBarProps {
  threshold: number;
  votesInfo: ProposalVotesInfo;
  isCompact: boolean;
}

export const VoteThresholdBar = ({
  threshold,
  votesInfo,
  isCompact,
}: VoteThresholdBarProps) => {
  const { yesNonRatio, noNonRatio, noWithVetoNonRatio } =
    normalizeVotesInfo(votesInfo);

  const thresholdPercent = formatPrettyPercent(threshold as Ratio<number>);
  return (
    <Flex direction={isCompact ? "column-reverse" : "column"} w="full">
      <Flex
        direction={isCompact ? "row" : "column"}
        alignItems="center"
        justifyContent="center"
        w="fit-content"
        ml={thresholdPercent}
        transform="translate(-50%)"
      >
        <Text variant="body3" color="accent.main" whiteSpace="preserve">
          Threshold{isCompact && ": "}
        </Text>
        <Text variant="body3" color="accent.main" fontWeight={700}>
          {thresholdPercent}
        </Text>
      </Flex>
      <Flex
        direction={isCompact ? "column" : "column-reverse"}
        h={isCompact ? 6 : 8}
        position="relative"
      >
        <Flex
          h={isCompact ? 5 : 7}
          overflow="hidden"
          borderRadius={100}
          bgColor="gray.800"
        >
          <BarSection
            percent={formatPrettyPercent(yesNonRatio)}
            color="success.main"
            option="Yes"
            textColor="background.main"
            isCompact={isCompact}
          />
          <BarSection
            percent={formatPrettyPercent(noNonRatio)}
            color="error.main"
            option="No"
            textColor="background.main"
            isCompact={isCompact}
          />
          <BarSection
            percent={formatPrettyPercent(noWithVetoNonRatio)}
            color="error.dark"
            option="No with veto"
            textColor="text.main"
            isCompact={isCompact}
          />
        </Flex>
        <Flex
          position="absolute"
          w="4px"
          ml={thresholdPercent}
          transform="translate(-50%)"
          bgColor="accent.main"
          h="full"
        />
      </Flex>
    </Flex>
  );
};
