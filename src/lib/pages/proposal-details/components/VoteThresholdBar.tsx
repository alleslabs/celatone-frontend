import { Flex, Text } from "@chakra-ui/react";

import { normalizeVotesInfo } from "../utils";
import type { ProposalVotesInfo, Ratio } from "lib/types";
import { formatPrettyPercent } from "lib/utils";

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
    gap={2}
    maxW={percent}
    minW={percent}
    whiteSpace="nowrap"
    bgColor={color}
    overflow="hidden"
  >
    {!isCompact && (
      <>
        <Text ml={2} variant="body2" color={textColor} fontWeight={700}>
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
    <Flex w="full" direction={isCompact ? "column-reverse" : "column"}>
      <Flex
        alignItems="center"
        ml={thresholdPercent}
        w="fit-content"
        direction={isCompact ? "row" : "column"}
        justifyContent="center"
        transform="translate(-50%)"
      >
        <Text variant="body3" whiteSpace="preserve" color="text.main">
          Threshold{isCompact && ": "}
        </Text>
        <Text variant="body3" color="text.main" fontWeight={700}>
          {thresholdPercent}
        </Text>
      </Flex>
      <Flex
        h={isCompact ? 6 : 8}
        direction={isCompact ? "column" : "column-reverse"}
        position="relative"
      >
        <Flex
          h={isCompact ? 5 : 7}
          bgColor="gray.800"
          borderRadius={100}
          overflow="hidden"
        >
          <BarSection
            percent={formatPrettyPercent(yesNonRatio)}
            color="success.main"
            isCompact={isCompact}
            option="Yes"
            textColor="background.main"
          />
          <BarSection
            percent={formatPrettyPercent(noNonRatio)}
            color="error.main"
            isCompact={isCompact}
            option="No"
            textColor="background.main"
          />
          <BarSection
            percent={formatPrettyPercent(noWithVetoNonRatio)}
            color="error.dark"
            isCompact={isCompact}
            option="No with veto"
            textColor="text.main"
          />
        </Flex>
        <Flex
          h="full"
          ml={thresholdPercent}
          w="4px"
          bgColor="text.main"
          position="absolute"
          transform="translate(-50%)"
        />
      </Flex>
    </Flex>
  );
};
