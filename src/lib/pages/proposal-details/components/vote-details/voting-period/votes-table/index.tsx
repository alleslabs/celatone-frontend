import type { ProposalAnswerCountsResponse } from "lib/services/types";
import type { Option, ProposalVote } from "lib/types";
import type { ChangeEvent } from "react";

import { Button, Flex, Grid, GridItem, TableContainer } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { SelectInputBase } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useProposalVotes } from "lib/services/proposal";
import { ProposalVoteType } from "lib/types";
import { useMemo, useState } from "react";

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
    fullVersion && !isMobile ? `1fr 0.8fr 1.5fr 1fr` : `3fr 1fr`;

  if (isLoading) return <Loading />;
  if (!proposalVotes) return <ErrorFetching dataName="votes" />;
  if (proposalVotes.length === 0)
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

  return (
    <TableContainer>
      <ProposalVotesTableHeader
        fullVersion={fullVersion}
        templateColumns={templateColumns}
      />
      {proposalVotes.map((each, idx) => (
        <ProposalVotesTableRow
          key={
            each.proposalId.toString() +
            (each.timestamp ?? "null") +
            (each.txHash ?? "null") +
            idx.toString()
          }
          fullVersion={fullVersion}
          proposalVote={each}
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
  enabled?: boolean;
}

const tableHeaderId = "proposalVotesTable";

export const ProposalVotesTable = ({
  id,
  answers,
  fullVersion,
  onViewMore,
  enabled,
}: ProposalVotesTableProps) => {
  const [answerFilter, setAnswerFilter] = useState<ProposalVoteType>(
    ProposalVoteType.ALL
  );
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

  const isSearching =
    debouncedSearch !== "" || answerFilter !== ProposalVoteType.ALL;

  const answerOptions = useMemo(
    () => [
      {
        label: `All votes (${answers?.total ?? 0})`,
        value: ProposalVoteType.ALL,
        disabled: !answers?.total,
      },
      {
        label: `Yes (${answers?.yes ?? 0})`,
        value: ProposalVoteType.YES,
        disabled: !answers?.yes,
        icon: "circle" as const,
        iconColor: "success.main",
      },
      {
        label: `No (${answers?.no ?? 0})`,
        value: ProposalVoteType.NO,
        disabled: !answers?.no,
        icon: "circle" as const,
        iconColor: "error.main",
      },
      {
        label: `No with veto (${answers?.noWithVeto ?? 0})`,
        value: ProposalVoteType.NO_WITH_VETO,
        disabled: !answers?.noWithVeto,
        icon: "circle" as const,
        iconColor: "error.dark",
      },
      {
        label: `Abstain (${answers?.abstain ?? 0})`,
        value: ProposalVoteType.ABSTAIN,
        disabled: !answers?.abstain,
        icon: "circle" as const,
        iconColor: "gray.600",
      },
      {
        label: `Weighted (${answers?.weighted ?? 0})`,
        value: ProposalVoteType.WEIGHTED,
        disabled: !answers?.weighted,
        icon: "circle" as const,
        iconColor: "primary.light",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(answers)]
  );

  const handleOnSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  const handleOnAnswerFilterChange = (newAnswer: ProposalVoteType) => {
    setCurrentPage(1);
    setAnswerFilter(newAnswer);
  };

  return (
    <>
      {fullVersion && (
        <Grid
          id={enabled ? tableHeaderId : undefined}
          gap={4}
          templateColumns={{ base: "1fr", md: "240px auto" }}
        >
          <GridItem>
            <SelectInputBase<ProposalVoteType>
              disableMaxH
              formLabel="Filter by answer"
              initialSelected={answerFilter}
              labelBgColor="gray.900"
              options={answerOptions}
              popoverBgColor="gray.800"
              onChange={handleOnAnswerFilterChange}
            />
          </GridItem>
          <GridItem>
            <InputWithIcon
              placeholder="Search with address or validator moniker..."
              size="lg"
              value={search}
              onChange={handleOnSearchChange}
            />
          </GridItem>
        </Grid>
      )}
      <ProposalVotesTableBody
        fullVersion={fullVersion}
        isLoading={isLoading}
        isSearching={isSearching}
        proposalVotes={data?.items}
      />
      {data &&
        data.total > 10 &&
        (onViewMore ? (
          <Flex justifyContent="center" mt={4} textAlign="center" w="full">
            <Button
              gap={2}
              variant="ghost-primary"
              w="full"
              onClick={onViewMore}
            >
              View all votes
              <CustomIcon boxSize="12px" name="chevron-right" />
            </Button>
          </Flex>
        ) : (
          fullVersion && (
            <Pagination
              currentPage={currentPage}
              offset={offset}
              pageSize={pageSize}
              pagesQuantity={pagesQuantity}
              scrollComponentId={tableHeaderId}
              totalData={data?.total ?? 0}
              onPageChange={setCurrentPage}
              onPageSizeChange={(e) => {
                const size = Number(e.target.value);
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )
        ))}
    </>
  );
};
