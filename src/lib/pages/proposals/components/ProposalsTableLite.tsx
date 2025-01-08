import { Alert, Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { useDebounce } from "lib/hooks";
import { useProposalDataLcd, useProposalsLcd } from "lib/services/proposal";
import type { ProposalStatus } from "lib/types";
import { isPositiveInt } from "lib/utils";

import { ProposalStatusFilter } from "./ProposalStatusFilter";

export const ProposalsTableLite = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [status, setStatus] = useState<ProposalStatus[]>([]);

  const {
    data: proposalsData,
    error: proposalsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isProposalsLoading,
  } = useProposalsLcd(status[0]);

  const { data: proposalData, isFetching: isProposalDataFetching } =
    useProposalDataLcd(Number(debouncedSearch), isPositiveInt(debouncedSearch));

  const proposal = proposalData ? [proposalData] : [];
  const proposals =
    debouncedSearch.trim().length > 0 ? proposal : proposalsData;

  const isLoadNext =
    hasNextPage &&
    !isProposalsLoading &&
    !isProposalDataFetching &&
    proposals &&
    proposals.length > 1;

  return (
    <>
      <Grid
        gridTemplateColumns={{ base: "1fr", md: "1fr 370px" }}
        gap={{ base: 4, md: 6 }}
        mb={{ base: 10, md: 8 }}
        mt={8}
      >
        <GridItem>
          <InputWithIcon
            size="lg"
            value={search}
            amptrackSection="proposal-list-search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search with Proposal ID"
          />
        </GridItem>
        <GridItem>
          <ProposalStatusFilter
            isMulti={false}
            label="Filter by Status"
            result={status}
            setResult={setStatus}
            placeholder="All Status"
          />
        </GridItem>
      </Grid>
      {showAlert && (
        <Alert gap={4} variant="info">
          <CustomIcon name="info-circle" boxSize={4} />
          <Text variant="body2" w="full" color="text.dark">
            <span style={{ fontWeight: 700 }}>Deposit Failed</span> and
            <span style={{ fontWeight: 700 }}> Cancelled</span> proposals are
            pruned from the network; thus, cannot be shown or searched here.
          </Text>
          <Button variant="ghost-gray" onClick={() => setShowAlert(false)}>
            Dismiss
          </Button>
        </Alert>
      )}
      <ProposalsTable
        emptyState={
          proposalsError ? (
            <ErrorFetching dataName="proposals" />
          ) : (
            <EmptyState
              imageVariant="not-found"
              message="No matches found. Please double-check your input and select correct network."
              withBorder
            />
          )
        }
        isLoading={isProposalsLoading || isProposalDataFetching}
        proposals={proposals}
      />
      {isLoadNext && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more 10 proposals"
        />
      )}
    </>
  );
};
