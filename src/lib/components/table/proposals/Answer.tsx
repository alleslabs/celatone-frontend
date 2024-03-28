import { Box, Flex, HStack, Text } from "@chakra-ui/react";

import { TooltipInfo } from "lib/components/Tooltip";
import type { Ratio } from "lib/types";
import { formatRatio } from "lib/utils";

interface AnswerProps {
  isVoteWeighted: boolean;
  yes: number;
  no: number;
  noWithVeto: number;
  abstain: number;
}

const resolveVote = ({
  isVoteWeighted,
  yes,
  no,
  noWithVeto,
  abstain,
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
  isVoteWeighted,
  yes,
  no,
  noWithVeto,
  abstain,
}: AnswerProps) => {
  const [color, text] = resolveVote({
    isVoteWeighted,
    yes,
    no,
    noWithVeto,
    abstain,
  });

  return (
    <HStack spacing={2}>
      <Box
        width="12px"
        height="12px"
        borderRadius="50%"
        backgroundColor={color}
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
            <Flex gap={1} key={label}>
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
