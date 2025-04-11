import type { ProposalVote } from "lib/types";

import { Text, VStack } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Answer } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";

interface VoterProps {
  proposalVote: ProposalVote;
}

export const Voter = ({ proposalVote }: VoterProps) => {
  const isMobile = useMobile();

  if (proposalVote.validator)
    return (
      <ValidatorBadge
        hasLabel={!isMobile}
        moreInfo={
          isMobile ? (
            <Answer
              abstain={proposalVote.abstain}
              isVoteWeighted={proposalVote.isVoteWeighted}
              no={proposalVote.no}
              noWithVeto={proposalVote.noWithVeto}
              yes={proposalVote.yes}
            />
          ) : undefined
        }
        validator={proposalVote.validator}
      />
    );

  if (proposalVote.voter)
    return (
      <VStack alignItems="flex-start" spacing={1}>
        <ExplorerLink
          showCopyOnHover
          type="user_address"
          value={proposalVote.voter}
        />
        {isMobile && (
          <Answer
            abstain={proposalVote.abstain}
            isVoteWeighted={proposalVote.isVoteWeighted}
            no={proposalVote.no}
            noWithVeto={proposalVote.noWithVeto}
            yes={proposalVote.yes}
          />
        )}
      </VStack>
    );

  return (
    <Text color="text.dark" variant="body2">
      N/A
    </Text>
  );
};
