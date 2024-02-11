import { Box, HStack, Text } from "@chakra-ui/react";

import { TooltipInfo } from "lib/components/Tooltip";
import type { ProposalVote } from "lib/types";

interface AnswerProps {
  proposalVote: ProposalVote;
}

const resolveVote = (proposalVote: ProposalVote): [string, string] => {
  if (proposalVote.isVoteWeighted) {
    return ["primary.light", "Weighted"];
  }
  if (proposalVote.yes === 1) {
    return ["success.main", "Yes"];
  }
  if (proposalVote.no === 1) {
    return ["error.main", "No"];
  }
  if (proposalVote.noWithVeto === 1) {
    return ["error.dark", "No with veto"];
  }
  if (proposalVote.abstain === 1) {
    return ["gray.600", "Abstain"];
  }
  return ["gray.600", "Did not vote"];
};

export const Answer = ({ proposalVote }: AnswerProps) => {
  const [color, text] = resolveVote(proposalVote);
  return (
    <HStack spacing={2}>
      <Box
        width="12px"
        height="12px"
        borderRadius="50%"
        backgroundColor={color}
      />
      <Text fontWeight={700}>{text}</Text>
      {proposalVote.isVoteWeighted && <TooltipInfo label="Weighted vote" />}
    </HStack>
  );
};
