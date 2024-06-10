import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";

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
  } = useProposalsLcd(status[0]);

  const { data: proposalData, isFetching: isProposalDataFetching } =
    useProposalDataLcd(debouncedSearch, isPositiveInt(debouncedSearch));

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
            result={status}
            setResult={setStatus}
            placeholder="All Status"
            isMulti={false}
          />
        </GridItem>
      </Grid>
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
