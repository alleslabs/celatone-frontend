import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  TableContainer,
} from "@chakra-ui/react";
import { useState, type ChangeEvent, useMemo, useEffect } from "react";

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
import { useProposalValidatorVotes } from "lib/services/proposalService";
import { ProposalValidatorVoteType } from "lib/types";
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

  const templateColumns = {
    head:
      fullVersion && !isMobile
        ? `${!isProposalResolved ? "0.2fr " : ""}1fr 0.8fr 1.5fr 1fr`
        : `${!isProposalResolved ? "0.1fr " : ""}1.5fr 1fr`,
    row:
      fullVersion && !isMobile
        ? `${!isProposalResolved ? "0.2fr " : ""}1fr 0.8fr 1.5fr 1fr`
        : `${!isProposalResolved ? "0.1fr " : ""}1.5fr 1fr`,
  };

  if (isLoading) return <Loading />;
  if (!validatorVotes) return <ErrorFetching dataName="votes" />;

  if (validatorVotes.length === 0) {
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
      <ValidatorVotesTableHeader
        templateColumns={templateColumns.head}
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
          templateColumns={templateColumns.row}
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
}

const tableHeaderId = "validatorVotesTable";

export const ValidatorVotesTable = ({
  id,
  answers,
  fullVersion,
  isProposalResolved,
  onViewMore,
}: ValidatorVotesTableProps) => {
  const [answerFilter, setAnswerFilter] = useState<ProposalValidatorVoteType>(
    ProposalValidatorVoteType.ALL
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
    debouncedSearch
  );

  // update total data because we do filter and search on frontend side
  useEffect(() => {
    setTotalData(data?.total ?? 0);
  }, [data, setTotalData]);

  const isSearching =
    debouncedSearch !== "" || answerFilter !== ProposalValidatorVoteType.ALL;

  const totalValidators = answers?.totalValidators ?? 0;

  const answerOptions = useMemo(
    () => [
      {
        label: `All votes (${totalValidators})`,
        value: ProposalValidatorVoteType.ALL,
        disabled: false,
      },
      {
        label: `Yes (${answers?.yes ?? 0})`,
        value: ProposalValidatorVoteType.YES,
        disabled: false,
      },
      {
        label: `No (${answers?.no ?? 0})`,
        value: ProposalValidatorVoteType.NO,
        disabled: false,
      },
      {
        label: `No with veto (${answers?.noWithVeto ?? 0})`,
        value: ProposalValidatorVoteType.NO_WITH_VETO,
        disabled: false,
      },
      {
        label: `Abstain (${answers?.abstain ?? 0})`,
        value: ProposalValidatorVoteType.ABSTAIN,
        disabled: false,
      },
      {
        label: `Weighted (${answers?.weighted ?? 0})`,
        value: ProposalValidatorVoteType.WEIGHTED,
        disabled: false,
      },
      {
        label: `Did not vote (${answers?.didNotVote ?? 0})`,
        value: ProposalValidatorVoteType.DID_NOT_VOTE,
        disabled: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [totalValidators, JSON.stringify(answers)]
  );

  const handleOnSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  const handleOnAnswerFilterChange = (newAnswer: ProposalValidatorVoteType) => {
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
            <SelectInput<ProposalValidatorVoteType>
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
      {!!totalValidators && fullVersion && (
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
      {onViewMore && !!totalValidators && totalValidators > 10 && (
        <Flex w="full" justifyContent="center" textAlign="center" mt={4}>
          <Button w="full" variant="ghost-primary" gap={2} onClick={onViewMore}>
            View all validator votes
            <CustomIcon name="chevron-right" boxSize="12px" />
          </Button>
        </Flex>
      )}
    </Box>
  );
};
