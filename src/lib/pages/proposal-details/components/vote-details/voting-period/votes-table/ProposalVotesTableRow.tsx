import { Button, Flex, Grid, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Answer, TableRow } from "lib/components/table";
import { useOpenTxTab } from "lib/hooks";
import type { ProposalVote } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";
import { Voter } from "../table/Voter";

interface ProposalVotesTableRowProps {
  proposalVote: ProposalVote;
  templateColumns: string;
  fullVersion: boolean;
}

export const ProposalVotesTableRow = ({
  proposalVote,
  templateColumns,
  fullVersion,
}: ProposalVotesTableRowProps) => {
  const isMobile = useMobile();
  const openTxTab = useOpenTxTab("tx-page");

  if (isMobile)
    return (
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        minW="min-content"
      >
        <TableRow pl={0}>
          <Voter proposalVote={proposalVote} />
        </TableRow>
        <TableRow justifyContent="flex-end" pr={0}>
          <Flex direction="column" alignItems="flex-end">
            {proposalVote.timestamp ? (
              <Text variant="body3" color="gray.500" textColor="text.dark">
                {dateFromNow(proposalVote.timestamp)}
              </Text>
            ) : (
              <Text variant="body2">N/A</Text>
            )}
            {proposalVote.txHash ? (
              <Button
                variant="unstyled"
                minW="unset"
                size="sm"
                disabled={!proposalVote.txHash}
                color="primary.main"
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
    <Grid templateColumns={templateColumns} minW="min-content">
      <TableRow>
        <Voter proposalVote={proposalVote} />
      </TableRow>
      <TableRow>
        <Answer
          isVoteWeighted={proposalVote.isVoteWeighted}
          yes={proposalVote.yes}
          no={proposalVote.no}
          noWithVeto={proposalVote.noWithVeto}
          abstain={proposalVote.abstain}
        />
      </TableRow>
      {fullVersion && (
        <>
          <TableRow>
            {proposalVote.timestamp ? (
              <Flex direction="column">
                <Text variant="body3">{formatUTC(proposalVote.timestamp)}</Text>
                <Text variant="body3" color="text.dark" mt="2px">
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
                type="tx_hash"
                value={proposalVote.txHash.toUpperCase()}
                showCopyOnHover
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
