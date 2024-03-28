import { Button, Flex, Grid, Text } from "@chakra-ui/react";

import { Voter } from "../table/Voter";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Answer, TableRow } from "lib/components/table";
import { useOpenTxTab } from "lib/hooks";
import type { ProposalValidatorVote } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface ValidatorVotesTableRowProps {
  proposalVote: ProposalValidatorVote;
  templateColumns: string;
  fullVersion: boolean;
  isProposalResolved: boolean;
}

export const ValidatorVotesTableRow = ({
  proposalVote,
  templateColumns,
  fullVersion,
  isProposalResolved,
}: ValidatorVotesTableRowProps) => {
  const isMobile = useMobile();
  const openTxTab = useOpenTxTab("tx-page");

  if (isMobile)
    return (
      <Grid templateColumns={templateColumns} minW="min-content">
        {!isProposalResolved && <TableRow pl={0}>{proposalVote.rank}</TableRow>}
        <TableRow>
          <Voter proposalVote={proposalVote} />
        </TableRow>
        <TableRow justifyContent="flex-end" pr={0}>
          <Flex direction="column" alignItems="flex-end">
            <Text variant="body3" color="gray.500" textColor="text.dark">
              {proposalVote.timestamp
                ? dateFromNow(proposalVote.timestamp)
                : "N/A"}
            </Text>
            {proposalVote.txHash ? (
              <Button
                variant="unstyled"
                minW="unset"
                size="sm"
                disabled={!proposalVote.txHash}
                color="secondary.main"
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
    <Grid templateColumns={templateColumns} minW="min-content">
      {!isProposalResolved && <TableRow>{proposalVote.rank}</TableRow>}
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
      {fullVersion && !isMobile && (
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
