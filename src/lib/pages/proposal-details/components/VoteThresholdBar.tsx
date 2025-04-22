import type { ProposalVotesInfo, Ratio } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { formatPrettyPercent } from "lib/utils";

import { normalizeVotesInfo } from "../utils";

interface BarSectionProps {
  color: string;
  isCompact: boolean;
  option: string;
  percent: string;
  textColor: string;
}

const BarSection = ({
  color,
  isCompact,
  option,
  percent,
  textColor,
}: BarSectionProps) => (
  <Flex
    alignItems="center"
    bgColor={color}
    gap={2}
    maxW={percent}
    minW={percent}
    overflow="hidden"
    whiteSpace="nowrap"
  >
    {!isCompact && (
      <>
        <Text color={textColor} fontWeight={700} ml={2} variant="body2">
          {percent}
        </Text>
        <Text color={textColor} variant="body2">
          {option}
        </Text>
      </>
    )}
  </Flex>
);

interface VoteThresholdBarProps {
  isCompact: boolean;
  threshold: number;
  votesInfo: ProposalVotesInfo;
}

export const VoteThresholdBar = ({
  isCompact,
  threshold,
  votesInfo,
}: VoteThresholdBarProps) => {
  const { noNonRatio, noWithVetoNonRatio, yesNonRatio } =
    normalizeVotesInfo(votesInfo);

  const thresholdPercent = formatPrettyPercent(threshold as Ratio<number>);
  return (
    <Flex direction={isCompact ? "column-reverse" : "column"} w="full">
      <Flex
        alignItems="center"
        direction={isCompact ? "row" : "column"}
        justifyContent="center"
        ml={thresholdPercent}
        transform="translate(-50%)"
        w="fit-content"
      >
        <Text color="text.main" variant="body3" whiteSpace="preserve">
          Threshold{isCompact && ": "}
        </Text>
        <Text color="text.main" fontWeight={700} variant="body3">
          {thresholdPercent}
        </Text>
      </Flex>
      <Flex
        direction={isCompact ? "column" : "column-reverse"}
        h={isCompact ? 6 : 8}
        position="relative"
      >
        <Flex
          bgColor="gray.800"
          borderRadius={100}
          h={isCompact ? 5 : 7}
          overflow="hidden"
        >
          <BarSection
            color="success.main"
            isCompact={isCompact}
            option="Yes"
            percent={formatPrettyPercent(yesNonRatio)}
            textColor="background.main"
          />
          <BarSection
            color="error.main"
            isCompact={isCompact}
            option="No"
            percent={formatPrettyPercent(noNonRatio)}
            textColor="background.main"
          />
          <BarSection
            color="error.dark"
            isCompact={isCompact}
            option="No with veto"
            percent={formatPrettyPercent(noWithVetoNonRatio)}
            textColor="text.main"
          />
        </Flex>
        <Flex
          bgColor="text.main"
          h="full"
          ml={thresholdPercent}
          position="absolute"
          transform="translate(-50%)"
          w="4px"
        />
      </Flex>
    </Flex>
  );
};
