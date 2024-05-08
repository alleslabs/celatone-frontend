import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";

import { SelectInput } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable, StatusChip } from "lib/components/table";
import { useDebounce } from "lib/hooks";
import {
  mapProposalStatusLcdToProposalStatus,
  useProposalDataLcd,
  useProposalsLcd,
} from "lib/services/proposal";
import { ProposalStatusLcd } from "lib/types";

export const ProposalsTableLite = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [proposalStatus, setProposalStatus] = useState<ProposalStatusLcd>(
    ProposalStatusLcd.ALL
  );

  const {
    data: proposalsData,
    error: proposalsError,
    fetchNextPage,
    hasNextPage,
    isLoading: isProposalsLoading,
    isFetchingNextPage,
  } = useProposalsLcd(proposalStatus);

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

  const options = Object.values(ProposalStatusLcd).map((status) => {
    const mapStatus = mapProposalStatusLcdToProposalStatus(status);

    return {
      label: status === ProposalStatusLcd.ALL ? "All Status" : mapStatus,
      value: status,
      disabled: false,
      chipContainerComponent: <StatusChip status={mapStatus} />,
    };
  });

  return (
    <>
      <Grid
        mt={8}
        mb={{ base: 6, md: 8 }}
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
          <SelectInput<ProposalStatusLcd>
            formLabel="Filter by Status"
            options={options}
            onChange={setProposalStatus}
            placeholder=""
            initialSelected={proposalStatus}
            disableMaxH
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
