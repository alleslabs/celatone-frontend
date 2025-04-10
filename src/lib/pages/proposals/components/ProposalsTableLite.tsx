import type { ProposalStatus } from "lib/types";

import { Alert, Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { useDebounce } from "lib/hooks";
import { useProposalDataRest, useProposalsRest } from "lib/services/proposal";
import { isPositiveInt } from "lib/utils";
import { useState } from "react";

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
    isLoading: isProposalsLoading,
    isFetchingNextPage,
  } = useProposalsRest(status[0]);

  const { data: proposalData, isFetching: isProposalDataFetching } =
    useProposalDataRest(
      Number(debouncedSearch),
      isPositiveInt(debouncedSearch)
    );

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
        gap={{ base: 4, md: 6 }}
        gridTemplateColumns={{ base: "1fr", md: "1fr 370px" }}
        mb={{ base: 10, md: 8 }}
        mt={8}
      >
        <GridItem>
          <InputWithIcon
            amptrackSection="proposal-list-search"
            placeholder="Search with proposal ID"
            size="lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </GridItem>
        <GridItem>
          <ProposalStatusFilter
            isMulti={false}
            label="Filter by status"
            placeholder="All status"
            result={status}
            setResult={setStatus}
          />
        </GridItem>
      </Grid>
      {showAlert && (
        <Alert gap={4} variant="info">
          <CustomIcon boxSize={4} name="info-circle" />
          <Text color="text.dark" variant="body2" w="full">
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
