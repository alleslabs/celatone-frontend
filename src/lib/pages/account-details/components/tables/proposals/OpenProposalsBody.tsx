import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ProposalCard } from "lib/components/card/ProposalCard";
import { Loading } from "lib/components/Loading";
import { ProposalsTable } from "lib/components/table";
import type { Option, Proposal } from "lib/types";

interface OpenedProposalsBodyProps {
  proposals: Option<Proposal[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  onViewMore?: () => void;
}

export const OpenedProposalsBody = ({
  proposals,
  isLoading,
  emptyState,
  onViewMore,
}: OpenedProposalsBodyProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading />;
  if (!proposals?.length) return emptyState;
  if (isMobile && !onViewMore)
    return (
      <Flex direction="column" gap={4} w="full" mt={4}>
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.proposalId} proposal={proposal} />
        ))}
      </Flex>
    );
  if (isMobile && onViewMore) return null;
  return (
    <ProposalsTable
      proposals={proposals}
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
};
