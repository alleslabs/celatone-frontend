import { Text, VStack } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Answer } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { ProposalVote } from "lib/types";

interface VoterProps {
  proposalVote: ProposalVote;
}

export const Voter = ({ proposalVote }: VoterProps) => {
  const isMobile = useMobile();

  if (proposalVote.validator)
    return (
      <ValidatorBadge
        validator={proposalVote.validator}
        hasLabel={!isMobile}
        moreInfo={
          isMobile ? (
            <Answer
              abstain={proposalVote.abstain}
              yes={proposalVote.yes}
              isVoteWeighted={proposalVote.isVoteWeighted}
              no={proposalVote.no}
              noWithVeto={proposalVote.noWithVeto}
            />
          ) : undefined
        }
      />
    );

  if (proposalVote.voter)
    return (
      <VStack alignItems="flex-start" spacing={1}>
        <ExplorerLink
          type="user_address"
          value={proposalVote.voter}
          showCopyOnHover
        />
        {isMobile && (
          <Answer
            abstain={proposalVote.abstain}
            yes={proposalVote.yes}
            isVoteWeighted={proposalVote.isVoteWeighted}
            no={proposalVote.no}
            noWithVeto={proposalVote.noWithVeto}
          />
        )}
      </VStack>
    );

  return (
    <Text variant="body2" color="text.dark">
      N/A
    </Text>
  );
};
