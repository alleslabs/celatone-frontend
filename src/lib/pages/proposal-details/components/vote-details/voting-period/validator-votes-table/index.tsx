import { Button, Flex, Grid, GridItem, TableContainer } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import { useMobile } from "lib/app-provider";
import { SelectInput } from "lib/components/forms";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useProposalValidatorVotes } from "lib/services/proposal";
import type { ProposalAnswerCountsResponse } from "lib/services/types";
import { ProposalVoteType } from "lib/types";
import type { Option, ProposalValidatorVote } from "lib/types";

import { ValidatorVotesTableHeader } from "./ValidatorVotesTableHeader";
import { ValidatorVotesTableRow } from "./ValidatorVotesTableRow";

interface ValidatorVotesTableBodyProps {
  validatorVotes: Option<ProposalValidatorVote[]>;
  fullVersion: boolean;
  isLoading: boolean;
  isSearching: boolean;
  isProposalResolved: boolean;
}

export const ValidatorVotesTableBody = ({
  validatorVotes,
  fullVersion,
  isLoading,
  isSearching,
  isProposalResolved,
  // eslint-disable-next-line sonarjs/cognitive-complexity
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
        templateColumns={templateColumns}
        fullVersion={fullVersion}
        isProposalResolved={isProposalResolved}
      />
      {validatorVotes.map((each, idx) => (
        <ValidatorVotesTableRow
          key={
            each.proposalId.toString() +
            (each.timestamp ?? "null") +
            (each.txHash ?? "null") +
            idx.toString()
          }
          proposalVote={each}
          fullVersion={fullVersion}
          templateColumns={templateColumns}
          isProposalResolved={isProposalResolved}
        />
      ))}
    </TableContainer>
  );
};

interface ValidatorVotesTableProps {
  id: number;
  answers: Option<ProposalAnswerCountsResponse["validator"]>;
  fullVersion: boolean;
  isProposalResolved: boolean;
  onViewMore?: () => void;
  enabled?: boolean;
}

const tableHeaderId = "validatorVotesTable";

export const ValidatorVotesTable = ({
  id,
  answers,
  fullVersion,
  isProposalResolved,
  onViewMore,
  enabled,
}: ValidatorVotesTableProps) => {
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
        label: `All votes (${answers?.totalValidators ?? 0})`,
        value: ProposalVoteType.ALL,
        disabled: !answers?.totalValidators,
      },
      {
        label: `Yes (${answers?.yes ?? 0})`,
        value: ProposalVoteType.YES,
        disabled: !answers?.yes,
        icon: "legend" as IconKeys,
        iconColor: "success.main",
      },
      {
        label: `No (${answers?.no ?? 0})`,
        value: ProposalVoteType.NO,
        disabled: !answers?.no,
        icon: "legend" as IconKeys,
        iconColor: "error.main",
      },
      {
        label: `No with veto (${answers?.noWithVeto ?? 0})`,
        value: ProposalVoteType.NO_WITH_VETO,
        disabled: !answers?.noWithVeto,
        icon: "legend" as IconKeys,
        iconColor: "error.dark",
      },
      {
        label: `Abstain (${answers?.abstain ?? 0})`,
        value: ProposalVoteType.ABSTAIN,
        disabled: !answers?.abstain,
        icon: "legend" as IconKeys,
        iconColor: "gray.600",
      },
      {
        label: `Did not vote (${answers?.didNotVote ?? 0})`,
        value: ProposalVoteType.DID_NOT_VOTE,
        disabled: !answers?.didNotVote,
        icon: "legend" as IconKeys,
        iconColor: "gray.600",
      },
      {
        label: `Weighted (${answers?.weighted ?? 0})`,
        value: ProposalVoteType.WEIGHTED,
        disabled: !answers?.weighted,
        icon: "legend" as IconKeys,
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
            <SelectInput<ProposalVoteType>
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
      <ValidatorVotesTableBody
        validatorVotes={data?.items}
        isLoading={isLoading}
        fullVersion={fullVersion}
        isSearching={isSearching}
        isProposalResolved={isProposalResolved}
      />
      {data &&
        data.total > 10 &&
        (onViewMore ? (
          <Flex w="full" justifyContent="center" textAlign="center" mt={4}>
            <Button
              w="full"
              variant="ghost-primary"
              gap={2}
              onClick={onViewMore}
            >
              View all validator votes
              <CustomIcon name="chevron-right" boxSize="12px" />
            </Button>
          </Flex>
        ) : (
          fullVersion && (
            <Pagination
              currentPage={currentPage}
              pagesQuantity={pagesQuantity}
              scrollComponentId={tableHeaderId}
              offset={offset}
              totalData={data?.total ?? 0}
              pageSize={pageSize}
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
