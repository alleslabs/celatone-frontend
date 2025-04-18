import type { ValidatorAddr } from "lib/types";
import type { ChangeEvent } from "react";

import { Alert, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { AmpEvent, trackUseFilter, trackUseViewMore } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { SelectInputBase } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableTitle, ViewMore } from "lib/components/table";
import { useDebounce } from "lib/hooks";
import {
  useValidatorVotedProposals,
  useValidatorVotedProposalsAnswerCounts,
} from "lib/services/validator";
import { ProposalVoteType } from "lib/types";
import { useMemo, useState } from "react";

import { VotedProposalsTableBody } from "./VotedProposalsTableBody";

const scrollComponentId = "voted-proposals-table-header";

interface VotedProposalsTableProps {
  validatorAddress: ValidatorAddr;
  onViewMore?: () => void;
}

export const VotedProposalsTable = ({
  onViewMore,
  validatorAddress,
}: VotedProposalsTableProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
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

  const { data, isLoading } = useValidatorVotedProposals(
    validatorAddress,
    onViewMore ? 5 : pageSize,
    offset,
    answerFilter,
    debouncedSearch,
    { onSuccess: ({ total }) => setTotalData(total) }
  );
  const { data: answers } =
    useValidatorVotedProposalsAnswerCounts(validatorAddress);

  const answerOptions = useMemo(
    () => [
      {
        disabled: !answers?.all,
        label: `All proposals (${answers?.all ?? 0})`,
        value: ProposalVoteType.ALL,
      },
      {
        disabled: !answers?.yes,
        hasLegend: true,
        iconColor: "success.main",
        label: `Yes (${answers?.yes ?? 0})`,
        value: ProposalVoteType.YES,
      },
      {
        disabled: !answers?.no,
        hasLegend: true,
        iconColor: "error.main",
        label: `No (${answers?.no ?? 0})`,
        value: ProposalVoteType.NO,
      },
      {
        disabled: !answers?.noWithVeto,
        hasLegend: true,
        iconColor: "error.dark",
        label: `No with veto (${answers?.noWithVeto ?? 0})`,
        value: ProposalVoteType.NO_WITH_VETO,
      },
      {
        disabled: !answers?.abstain,
        hasLegend: true,
        iconColor: "gray.600",
        label: `Abstain (${answers?.abstain ?? 0})`,
        value: ProposalVoteType.ABSTAIN,
      },
      {
        disabled: !answers?.didNotVote,
        hasLegend: true,
        iconColor: "gray.600",
        label: `Did not vote (${answers?.didNotVote ?? 0})`,
        value: ProposalVoteType.DID_NOT_VOTE,
      },
      {
        disabled: !answers?.weighted,
        hasLegend: true,
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
    trackUseFilter(
      AmpEvent.USE_FILTER_VOTED_PROPOSALS_ANSWER,
      Object.values(ProposalVoteType),
      newAnswer
    );
    setCurrentPage(1);
    setAnswerFilter(newAnswer);
  };

  return isMobileOverview ? (
    <Flex
      alignItems="center"
      backgroundColor="gray.900"
      justifyContent="space-between"
      p={4}
      rounded={8}
      w="100%"
      onClick={() => {
        trackUseViewMore();
        onViewMore();
      }}
    >
      <TableTitle count={answers?.all ?? 0} mb={0} title="Voted proposals" />
      <CustomIcon boxSize={6} color="gray.600" m={0} name="chevron-right" />
    </Flex>
  ) : (
    <Flex direction="column" gap={6}>
      <TableTitle count={answers?.all ?? 0} mb={0} title="Voted proposals" />
      {!onViewMore && (
        <>
          <Alert display={{ base: "none", md: "flex" }} gap={4} variant="info">
            <CustomIcon boxSize={4} name="info-circle" />
            <Text color="text.dark" variant="body2">
              Kindly note that the validator may not have voted on the proposal
              due to ineligibility, such as being recently added to the network.
            </Text>
          </Alert>
          <Grid gap={4} templateColumns={{ base: "1fr", md: "240px auto" }}>
            <GridItem>
              <SelectInputBase<ProposalVoteType>
                disableMaxH
                formLabel="Filter by vote answer"
                initialSelected={answerFilter}
                labelBgColor="background.main"
                options={answerOptions}
                popoverBgColor="gray.800"
                onChange={handleOnAnswerFilterChange}
              />
            </GridItem>
            <GridItem>
              <InputWithIcon
                amptrackSection="voted-proposals-search"
                placeholder="Search with proposal ID or proposal title..."
                size="lg"
                value={search}
                onChange={handleOnSearchChange}
              />
            </GridItem>
          </Grid>
        </>
      )}
      <VotedProposalsTableBody
        data={data}
        isLoading={isLoading}
        search={search}
        onViewMore={onViewMore}
      />
      {data &&
        (onViewMore
          ? data.total > 5 && (
              <ViewMore
                text={`View all proposals (${data.total})`}
                onClick={onViewMore}
              />
            )
          : data.total > 10 && (
              <Pagination
                currentPage={currentPage}
                offset={offset}
                pageSize={pageSize}
                pagesQuantity={pagesQuantity}
                scrollComponentId={scrollComponentId}
                totalData={data.total}
                onPageChange={setCurrentPage}
                onPageSizeChange={(e) => {
                  const size = Number(e.target.value);
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            ))}
    </Flex>
  );
};
