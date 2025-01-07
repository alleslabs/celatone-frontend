import { Button, Flex, Grid, Text } from "@chakra-ui/react";

import { Voter } from "../table/Voter";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Answer, TableRow } from "lib/components/table";
import { useOpenTxTab } from "lib/hooks";
import type { ProposalValidatorVote } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface ValidatorVotesTableRowProps {
  fullVersion: boolean;
  isProposalResolved: boolean;
  proposalVote: ProposalValidatorVote;
  templateColumns: string;
}

export const ValidatorVotesTableRow = ({
  fullVersion,
  isProposalResolved,
  proposalVote,
  templateColumns,
}: ValidatorVotesTableRowProps) => {
  const isMobile = useMobile();
  const openTxTab = useOpenTxTab("tx-page");

  if (isMobile)
    return (
      <Grid
        className="copier-wrapper"
        minW="min-content"
        templateColumns={templateColumns}
      >
        {!isProposalResolved && <TableRow pl={0}>{proposalVote.rank}</TableRow>}
        <TableRow>
          <Voter proposalVote={proposalVote} />
        </TableRow>
        <TableRow pr={0} justifyContent="flex-end">
          <Flex alignItems="flex-end" direction="column">
            <Text variant="body3" color="gray.500" textColor="text.dark">
              {proposalVote.timestamp
                ? dateFromNow(proposalVote.timestamp)
                : "N/A"}
            </Text>
            {proposalVote.txHash ? (
              <Button
                disabled={!proposalVote.txHash}
                minW="unset"
                size="sm"
                variant="unstyled"
                color="primary.main"
                onClick={() =>
                  proposalVote.txHash && openTxTab(proposalVote.txHash)
                }
              >
                View Tx
              </Button>
            ) : (
              <Text variant="body3" textColor="text.dark">
                N/A
              </Text>
            )}
          </Flex>
        </TableRow>
      </Grid>
    );

  return (
    <Grid minW="min-content" templateColumns={templateColumns}>
      {!isProposalResolved && <TableRow>{proposalVote.rank}</TableRow>}
      <TableRow>
        <Voter proposalVote={proposalVote} />
      </TableRow>
      <TableRow>
        <Answer
          abstain={proposalVote.abstain}
          yes={proposalVote.yes}
          isVoteWeighted={proposalVote.isVoteWeighted}
          no={proposalVote.no}
          noWithVeto={proposalVote.noWithVeto}
        />
      </TableRow>
      {fullVersion && (
        <>
          <TableRow>
            {proposalVote.timestamp ? (
              <Flex direction="column">
                <Text variant="body3">{formatUTC(proposalVote.timestamp)}</Text>
                <Text mt="2px" variant="body3" color="text.dark">
                  ({dateFromNow(proposalVote.timestamp)})
                </Text>
              </Flex>
            ) : (
              <Text variant="body3" textColor="text.dark">
                N/A
              </Text>
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
              <Text variant="body3" textColor="text.dark">
                N/A
              </Text>
            )}
          </TableRow>
        </>
      )}
    </Grid>
  );
};
