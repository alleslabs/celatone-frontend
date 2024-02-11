import { Box, Grid, GridItem, TableContainer } from "@chakra-ui/react";
import { useState, type ChangeEvent, useMemo } from "react";

import { useMobile } from "lib/app-provider";
import { SelectInput } from "lib/components/forms";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import type { ProposalAnswerCountsResponse } from "lib/services/proposal";
import { useProposalVotes } from "lib/services/proposalService";
import type { Option, ProposalVote } from "lib/types";

import { ProposalVotesTableHeader } from "./ProposalVotesTableHeader";
import { ProposalVotesTableRow } from "./ProposalVotesTableRow";

interface ProposalVotesTableBodyProps {
  proposalVotes: Option<ProposalVote[]>;
  fullVersion: boolean;
  isLoading: boolean;
}

export const ProposalVotesTableBody = ({
  proposalVotes,
  fullVersion,
  isLoading,
}: ProposalVotesTableBodyProps) => {
  const isMobile = useMobile();
  const templateColumns =
    fullVersion && !isMobile ? `1fr 0.8fr 1.5fr 1fr` : `2fr 1fr`;

  if (isLoading) return <Loading />;
  if (!proposalVotes) return <ErrorFetching dataName="voter" />;

  if (proposalVotes.length === 0) {
    return (
      <EmptyState
        imageVariant="not-found"
        message="The proposal has no votes yet."
      />
    );
  }
  return (
    <TableContainer>
      <ProposalVotesTableHeader
        templateColumns={templateColumns}
        fullVersion={fullVersion}
      />
      {proposalVotes.map((each, idx) => (
        <ProposalVotesTableRow
          key={
            each.proposalId.toString() +
            (each.timestamp ?? "null") +
            (each.txHash ?? "null") +
            idx.toString()
          }
          proposalVote={each}
          fullVersion={fullVersion}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};

interface ProposalVotesTableProps {
  id: number;
  answers: Option<ProposalAnswerCountsResponse["all"]>;
  fullVersion: boolean;
}

// pass it to api
enum AnswerType {
  ALL = "all",
  YES = "yes",
  NO = "no",
  NO_WITH_VETO = "no_with_veto",
  ABSTAIN = "abstain",
  WEIGHTED = "weighted",
}

export const ProposalVotesTable = ({
  id,
  answers,
  fullVersion,
}: ProposalVotesTableProps) => {
  const [answerFilter, setAnswerFilter] = useState<AnswerType>(AnswerType.ALL);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useProposalVotes(
    id,
    10,
    0,
    answerFilter,
    debouncedSearch
  );

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: answers?.total,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const total = answers?.total ?? 0;

  const answerOptions = useMemo(
    () => [
      {
        label: `All votes (${total})`,
        value: AnswerType.ALL,
        disabled: false,
      },
      {
        label: `Yes (${answers?.yes ?? 0})`,
        value: AnswerType.YES,
        disabled: false,
      },
      {
        label: `No (${answers?.no ?? 0})`,
        value: AnswerType.NO,
        disabled: false,
      },
      {
        label: `No with veto (${answers?.noWithVeto ?? 0})`,
        value: AnswerType.NO_WITH_VETO,
        disabled: false,
      },
      {
        label: `Abstain (${answers?.abstain ?? 0})`,
        value: AnswerType.ABSTAIN,
        disabled: false,
      },
      {
        label: `Weighted (${answers?.weighted ?? 0})`,
        value: AnswerType.WEIGHTED,
        disabled: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [total, JSON.stringify(answers)]
  );

  const handleOnSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  const handleOnAnswerFilterChange = (newAnswer: AnswerType) => {
    setCurrentPage(1);
    setAnswerFilter(newAnswer);
  };

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <Box>
      {fullVersion && (
        <Grid gap={4} templateColumns="240px auto">
          <GridItem>
            <SelectInput<AnswerType>
              formLabel="Filter by Answer"
              options={answerOptions}
              onChange={handleOnAnswerFilterChange}
              initialSelected={answerFilter}
            />
          </GridItem>
          <GridItem>
            <InputWithIcon
              placeholder="Search with address or validator moniker..."
              value={search}
              onChange={handleOnSearchChange}
              size={{ base: "md", md: "lg" }}
            />
          </GridItem>
        </Grid>
      )}
      <ProposalVotesTableBody
        proposalVotes={data?.items}
        isLoading={isLoading}
        fullVersion={fullVersion}
      />
      {!!total && fullVersion && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Box>
  );
};
