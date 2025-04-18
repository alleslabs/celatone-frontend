import type { ProposalVote } from "lib/types";

import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Answer, TableRow } from "lib/components/table";
import { useOpenTxTab } from "lib/hooks";
import { dateFromNow, formatUTC } from "lib/utils";

import { Voter } from "../table/Voter";

interface ProposalVotesTableRowProps {
  proposalVote: ProposalVote;
  templateColumns: string;
  fullVersion: boolean;
}

export const ProposalVotesTableRow = ({
  fullVersion,
  proposalVote,
  templateColumns,
}: ProposalVotesTableRowProps) => {
  const isMobile = useMobile();
  const openTxTab = useOpenTxTab("tx-page");

  if (isMobile)
    return (
      <Grid
        className="copier-wrapper"
        minW="min-content"
        templateColumns={templateColumns}
      >
        <TableRow pl={0}>
          <Voter proposalVote={proposalVote} />
        </TableRow>
        <TableRow justifyContent="flex-end" pr={0}>
          <Flex alignItems="flex-end" direction="column">
            {proposalVote.timestamp ? (
              <Text color="gray.500" textColor="text.dark" variant="body3">
                {dateFromNow(proposalVote.timestamp)}
              </Text>
            ) : (
              <Text variant="body2">N/A</Text>
            )}
            {proposalVote.txHash ? (
              <Button
                color="primary.main"
                disabled={!proposalVote.txHash}
                minW="unset"
                size="sm"
                variant="unstyled"
                onClick={() =>
                  proposalVote.txHash && openTxTab(proposalVote.txHash)
                }
              >
                View Tx
              </Button>
            ) : (
              <Text variant="body2">N/A</Text>
            )}
          </Flex>
        </TableRow>
      </Grid>
    );

  return (
    <Grid minW="min-content" templateColumns={templateColumns}>
      <TableRow>
        <Voter proposalVote={proposalVote} />
      </TableRow>
      <TableRow>
        <Answer
          abstain={proposalVote.abstain}
          isVoteWeighted={proposalVote.isVoteWeighted}
          no={proposalVote.no}
          noWithVeto={proposalVote.noWithVeto}
          yes={proposalVote.yes}
        />
      </TableRow>
      {fullVersion && (
        <>
          <TableRow>
            {proposalVote.timestamp ? (
              <Flex direction="column">
                <Text variant="body3">{formatUTC(proposalVote.timestamp)}</Text>
                <Text color="text.dark" mt="2px" variant="body3">
                  ({dateFromNow(proposalVote.timestamp)})
                </Text>
              </Flex>
            ) : (
              <Text variant="body2">N/A</Text>
            )}
          </TableRow>
          <TableRow>
            {proposalVote.txHash ? (
              <ExplorerLink
                showCopyOnHover
                type="tx_hash"
                value={proposalVote.txHash.toUpperCase()}
              />
            ) : (
              <Text variant="body2">N/A</Text>
            )}
          </TableRow>
        </>
      )}
    </Grid>
  );
};
