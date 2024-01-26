import { Flex, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { trackMintScan } from "lib/amplitude";
import { useBaseApiRoute, useCelatoneApp } from "lib/app-provider";
import { ExplorerLink, getNavigationUrl } from "lib/components/ExplorerLink";
import type { Proposal } from "lib/types";
import { ProposalStatus } from "lib/types";
import { openNewTab } from "lib/utils";

import { Proposer } from "./Proposer";
import { ResolvedHeight } from "./ResolvedHeight";
import { StatusChip } from "./StatusChip";
import { VotingEndTime } from "./VotingEndTime";

export interface ProposalsTableMobileCardProps {
  proposal: Proposal;
}

export const ProposalsTableMobileCard = ({
  proposal,
}: ProposalsTableMobileCardProps) => {
  const isDepositFailed = proposal.status === ProposalStatus.DEPOSIT_FAILED;
  const isDepositOrVoting =
    proposal.status === ProposalStatus.DEPOSIT_PERIOD ||
    proposal.status === ProposalStatus.VOTING_PERIOD;
  const {
    chainConfig: { explorerLink },
  } = useCelatoneApp();
  const lcdEndpoint = useBaseApiRoute("rest");

  return (
    <MobileCardTemplate
      topContent={
        <>
          <Flex gap={2} align="center">
            <MobileLabel label="Proposal ID" variant="body2" />
            <ExplorerLink
              isReadOnly={isDepositFailed}
              type="proposal_id"
              value={proposal.proposalId.toString()}
              showCopyOnHover
            />
          </Flex>
          <StatusChip status={proposal.status} />
        </>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column" gap={1}>
            <MobileLabel label="Proposal Title" />
            <Text color="text.main" variant="body2" wordBreak="break-word">
              {proposal.title}
            </Text>
            {proposal.types.map((msgType) => (
              <Text color="text.dark" variant="body3" wordBreak="break-word">
                {msgType}
              </Text>
            ))}
          </Flex>
          <Flex direction="column" gap={1}>
            <MobileLabel label="Voting Ends" />
            <VotingEndTime
              votingEndTime={proposal.votingEndTime}
              depositEndTime={proposal.depositEndTime}
              status={proposal.status}
            />
          </Flex>
        </Flex>
      }
      bottomContent={
        <>
          <Flex direction="column" flex="1">
            <MobileLabel label="Resolved Block Height" />
            <ResolvedHeight
              resolvedHeight={proposal.resolvedHeight}
              isDepositOrVoting={isDepositOrVoting}
            />
          </Flex>
          <Flex direction="column" flex="1">
            <MobileLabel label="Proposed by" />
            <Proposer proposer={proposal.proposer} />
          </Flex>
        </>
      }
      onClick={
        !isDepositFailed
          ? () => {
              trackMintScan("proposal-detail", {
                types: proposal.types,
                status: proposal.status,
              });
              // TOOD: revisit retrieving url (make a proper hook)
              openNewTab(
                getNavigationUrl({
                  type: "proposal_id",
                  explorerConfig: explorerLink,
                  value: proposal.proposalId.toString(),
                  lcdEndpoint,
                })
              );
            }
          : undefined
      }
    />
  );
};
