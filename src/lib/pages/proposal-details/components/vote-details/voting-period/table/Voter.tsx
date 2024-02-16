import { Text, VStack } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { ProposalVote } from "lib/types";

import { Answer } from "./Answer";

interface VoterProps {
  proposalVote: ProposalVote;
}

export const Voter = ({ proposalVote }: VoterProps) => {
  const isMobile = useMobile();

  if (proposalVote.validator) {
    return (
      <ValidatorBadge
        validator={proposalVote.validator}
        hasLabel={!isMobile}
        moreInfo={isMobile ? <Answer proposalVote={proposalVote} /> : undefined}
      />
    );
  }

  if (proposalVote.voter) {
    return (
      <VStack spacing={1} alignItems="flex-start">
        <ExplorerLink
          type="user_address"
          value={proposalVote.voter}
          showCopyOnHover
        />
        {isMobile && <Answer proposalVote={proposalVote} />}
      </VStack>
    );
  }

  return (
    <Text variant="body2" color="text.dark">
      -
    </Text>
  );
};
