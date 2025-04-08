import { Alert, Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { useState } from "react";

import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { useDebounce } from "lib/hooks";
import { useProposalDataRest, useProposalsRest } from "lib/services/proposal";
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
        mt={8}
        mb={{ base: 10, md: 8 }}
        gridTemplateColumns={{ base: "1fr", md: "1fr 370px" }}
        gap={{ base: 4, md: 6 }}
      >
        <GridItem>
          <InputWithIcon
            placeholder="Search with proposal ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
            amptrackSection="proposal-list-search"
          />
        </GridItem>
        <GridItem>
          <ProposalStatusFilter
            label="Filter by status"
            result={status}
            setResult={setStatus}
            placeholder="All status"
            isMulti={false}
          />
        </GridItem>
      </Grid>
      {showAlert && (
        <Alert variant="info" gap={4}>
          <CustomIcon boxSize={4} name="info-circle" />
          <Text variant="body2" color="text.dark" w="full">
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
        proposals={proposals}
        isLoading={isProposalsLoading || isProposalDataFetching}
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
      />
      {isLoadNext && (
        <LoadNext
          text="Load more 10 proposals"
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
};
