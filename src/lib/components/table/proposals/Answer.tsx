import { Box, Flex, HStack, Text } from "@chakra-ui/react";

import { TooltipInfo } from "lib/components/Tooltip";
import type { Ratio } from "lib/types";
import { formatRatio } from "lib/utils";

interface AnswerProps {
  abstain: number;
  isVoteWeighted: boolean;
  no: number;
  noWithVeto: number;
  yes: number;
}

const resolveVote = ({
  abstain,
  isVoteWeighted,
  no,
  noWithVeto,
  yes,
}: AnswerProps): [string, string] => {
  if (isVoteWeighted) {
    return ["primary.light", "Weighted"];
  }
  if (yes === 1) {
    return ["success.main", "Yes"];
  }
  if (no === 1) {
    return ["error.main", "No"];
  }
  if (noWithVeto === 1) {
    return ["error.dark", "No with veto"];
  }
  if (abstain === 1) {
    return ["gray.600", "Abstain"];
  }
  return ["gray.600", "Did not vote"];
};

export const Answer = ({
  abstain,
  isVoteWeighted,
  no,
  noWithVeto,
  yes,
}: AnswerProps) => {
  const [color, text] = resolveVote({
    abstain,
    isVoteWeighted,
    no,
    noWithVeto,
    yes,
  });

  return (
    <HStack spacing={2}>
      <Box
        minW="12px"
        backgroundColor={color}
        borderRadius="50%"
        boxSize="12px"
      />
      <Text fontWeight={700}>{text}</Text>
      {isVoteWeighted && (
        <TooltipInfo
          label={[
            ["Yes", yes],
            ["No", no],
            ["No With Veto", noWithVeto],
            ["Abstain", abstain],
          ].map(([label, value]) => (
            <Flex key={label} gap={1}>
              <Text>{label}:</Text>
              <Text fontWeight={700}>
                {formatRatio(value as Ratio<number>)}
              </Text>
            </Flex>
          ))}
        />
      )}
    </HStack>
  );
};
