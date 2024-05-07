import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { useDebounce } from "lib/hooks";
import {
  useProposalDataLcd,
  useProposalsLcd,
} from "lib/services/wasm/proposal";
import type { ProposalStatus } from "lib/types";

import { ProposalStatusFilter } from "./ProposalStatusFilter";

export const ProposalsTableLite = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [statuses, setStatuses] = useState<ProposalStatus[]>([]);

  const {
    data: proposalsData,
    error: proposalsError,
    fetchNextPage,
    hasNextPage,
    isLoading: isProposalsLoading,
    isFetchingNextPage,
  } = useProposalsLcd();

  const { data: proposalData, isLoading: isProposalDataLoading } =
    useProposalDataLcd(debouncedSearch);

  const proposal = proposalData ? [proposalData] : [];
  const proposals =
    debouncedSearch.trim().length > 0 ? proposal : proposalsData;

  const isLoadNext =
    hasNextPage &&
    !isProposalsLoading &&
    !isProposalDataLoading &&
    proposals &&
    proposals.length > 1;

  // TODO: filter by status

  return (
    <>
      <Grid
        mt={8}
        mb={{ base: 16, md: 8 }}
        gridTemplateColumns={{ base: "1fr", md: "1fr 370px" }}
        gap={{ base: 3, md: 6 }}
      >
        <GridItem>
          <InputWithIcon
            placeholder="Search with Proposal ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
            amptrackSection="proposal-list-search"
          />
        </GridItem>
        <GridItem>
          <ProposalStatusFilter
            label="Filter by Status"
            result={statuses}
            setResult={setStatuses}
            placeholder="All Status"
          />
        </GridItem>
      </Grid>
      <ProposalsTable
        proposals={proposals}
        isLoading={isProposalsLoading || isProposalDataLoading}
        emptyState={
          proposalsError ? (
            <ErrorFetching dataName="proposals" />
          ) : (
            <>
              {statuses.length > 0 || search.trim().length > 0 ? (
                <EmptyState
                  imageVariant="not-found"
                  message="No matches found. Please double-check your input and select correct network."
                  withBorder
                />
              ) : (
                <EmptyState
                  imageVariant="empty"
                  message="There are no proposals on this network."
                  withBorder
                />
              )}
            </>
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
