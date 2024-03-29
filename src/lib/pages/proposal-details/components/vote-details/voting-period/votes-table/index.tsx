import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  TableContainer,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import { useMobile } from "lib/app-provider";
import { SelectInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
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
  isSearching: boolean;
}

export const ProposalVotesTableBody = ({
  proposalVotes,
  fullVersion,
  isLoading,
  isSearching,
}: ProposalVotesTableBodyProps) => {
  const isMobile = useMobile();
  const templateColumns =
    fullVersion && !isMobile ? `1fr 0.8fr 1.5fr 1fr` : `2fr 1fr`;

  if (isLoading) return <Loading />;
  if (!proposalVotes) return <ErrorFetching dataName="votes" />;

  if (proposalVotes.length === 0) {
    return (
      <EmptyState
        imageVariant="empty"
        message={
          isSearching
            ? "There are no vote matches your result."
            : "The proposal has no votes yet."
        }
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
  onViewMore?: () => void;
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

const tableHeaderId = "proposalVotesTable";

export const ProposalVotesTable = ({
  id,
  answers,
  fullVersion,
  onViewMore,
}: ProposalVotesTableProps) => {
  const [answerFilter, setAnswerFilter] = useState<AnswerType>(AnswerType.ALL);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const {
    pagesQuantity,
    setTotalData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data, isLoading } = useProposalVotes(
    id,
    pageSize,
    offset,
    answerFilter,
    debouncedSearch,
    { onSuccess: ({ total }) => setTotalData(total) }
  );

  const isSearching = debouncedSearch !== "" || answerFilter !== AnswerType.ALL;

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
    <Box id={tableHeaderId}>
      {fullVersion && (
        <Grid gap={4} templateColumns={{ base: "1fr", md: "240px auto" }}>
          <GridItem>
            <SelectInput<AnswerType>
              formLabel="Filter by Answer"
              options={answerOptions}
              onChange={handleOnAnswerFilterChange}
              labelBgColor="gray.900"
              initialSelected={answerFilter}
              popoverBgColor="gray.800"
              disableMaxH
            />
          </GridItem>
          <GridItem>
            <InputWithIcon
              placeholder="Search with address or validator moniker..."
              value={search}
              onChange={handleOnSearchChange}
              size="lg"
            />
          </GridItem>
        </Grid>
      )}
      <ProposalVotesTableBody
        proposalVotes={data?.items}
        isLoading={isLoading}
        fullVersion={fullVersion}
        isSearching={isSearching}
      />
      {!!total && fullVersion && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          scrollComponentId={tableHeaderId}
          offset={offset}
          totalData={data?.total ?? 0}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
      {onViewMore && !!total && total > 10 && (
        <Flex w="full" justifyContent="center" textAlign="center" mt={4}>
          <Button w="full" variant="ghost-primary" gap={2} onClick={onViewMore}>
            View all votes
            <CustomIcon name="chevron-right" boxSize="12px" />
          </Button>
        </Flex>
      )}
    </Box>
  );
};
