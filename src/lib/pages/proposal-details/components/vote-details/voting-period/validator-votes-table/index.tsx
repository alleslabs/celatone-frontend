import type { ProposalAnswerCountsResponse } from "lib/services/types";
import type { Option, ProposalValidatorVote } from "lib/types";
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
import { useProposalValidatorVotes } from "lib/services/proposal";
import { ProposalVoteType } from "lib/types";
import { useMemo, useState } from "react";

import { ValidatorVotesTableHeader } from "./ValidatorVotesTableHeader";
import { ValidatorVotesTableRow } from "./ValidatorVotesTableRow";

interface ValidatorVotesTableBodyProps {
  fullVersion: boolean;
  isLoading: boolean;
  isProposalResolved: boolean;
  isSearching: boolean;
  validatorVotes: Option<ProposalValidatorVote[]>;
}

export const ValidatorVotesTableBody = ({
  fullVersion,
  isLoading,
  isProposalResolved,
  isSearching,
  validatorVotes,
}: ValidatorVotesTableBodyProps) => {
  const isMobile = useMobile();

  const templateColumns =
    fullVersion && !isMobile
      ? `${!isProposalResolved ? "32px " : ""}1fr 0.8fr 1.5fr 1fr`
      : `${!isProposalResolved ? "32px " : ""}1.5fr 0.5fr`;

  if (isLoading) return <Loading />;
  if (!validatorVotes) return <ErrorFetching dataName="votes" />;
  if (validatorVotes.length === 0)
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
      <ValidatorVotesTableHeader
        fullVersion={fullVersion}
        isProposalResolved={isProposalResolved}
        templateColumns={templateColumns}
      />
      {validatorVotes.map((each, idx) => (
        <ValidatorVotesTableRow
          key={
            each.proposalId.toString() +
            (each.timestamp ?? "null") +
            (each.txHash ?? "null") +
            idx.toString()
          }
          fullVersion={fullVersion}
          isProposalResolved={isProposalResolved}
          proposalVote={each}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};

interface ValidatorVotesTableProps {
  answers: Option<ProposalAnswerCountsResponse["validator"]>;
  enabled?: boolean;
  fullVersion: boolean;
  id: number;
  isProposalResolved: boolean;
  onViewMore?: () => void;
}

const tableHeaderId = "validatorVotesTable";

export const ValidatorVotesTable = ({
  answers,
  enabled,
  fullVersion,
  id,
  isProposalResolved,
  onViewMore,
}: ValidatorVotesTableProps) => {
  const [answerFilter, setAnswerFilter] = useState<ProposalVoteType>(
    ProposalVoteType.ALL
  );
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
  });

  const { data, isLoading } = useProposalValidatorVotes(
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
        disabled: !answers?.totalValidators,
        label: `All votes (${answers?.totalValidators ?? 0})`,
        value: ProposalVoteType.ALL,
      },
      {
        disabled: !answers?.yes,
        icon: "circle" as const,
        iconColor: "success.main",
        label: `Yes (${answers?.yes ?? 0})`,
        value: ProposalVoteType.YES,
      },
      {
        disabled: !answers?.no,
        icon: "circle" as const,
        iconColor: "error.main",
        label: `No (${answers?.no ?? 0})`,
        value: ProposalVoteType.NO,
      },
      {
        disabled: !answers?.noWithVeto,
        icon: "circle" as const,
        iconColor: "error.dark",
        label: `No with veto (${answers?.noWithVeto ?? 0})`,
        value: ProposalVoteType.NO_WITH_VETO,
      },
      {
        disabled: !answers?.abstain,
        icon: "circle" as const,
        iconColor: "gray.600",
        label: `Abstain (${answers?.abstain ?? 0})`,
        value: ProposalVoteType.ABSTAIN,
      },
      {
        disabled: !answers?.didNotVote,
        icon: "circle" as const,
        iconColor: "gray.600",
        label: `Did not vote (${answers?.didNotVote ?? 0})`,
        value: ProposalVoteType.DID_NOT_VOTE,
      },
      {
        disabled: !answers?.weighted,
        icon: "circle" as const,
        iconColor: "primary.light",
        label: `Weighted (${answers?.weighted ?? 0})`,
        value: ProposalVoteType.WEIGHTED,
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
      <ValidatorVotesTableBody
        fullVersion={fullVersion}
        isLoading={isLoading}
        isProposalResolved={isProposalResolved}
        isSearching={isSearching}
        validatorVotes={data?.items}
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
              View all validator votes
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
