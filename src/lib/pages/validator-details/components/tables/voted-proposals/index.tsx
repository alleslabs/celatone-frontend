import { Alert, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

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
import type { ValidatorAddr } from "lib/types";

import { VotedProposalsTableBody } from "./VotedProposalsTableBody";

const scrollComponentId = "voted-proposals-table-header";

interface VotedProposalsTableProps {
  onViewMore?: () => void;
  validatorAddress: ValidatorAddr;
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
      p={4}
      w="100%"
      backgroundColor="gray.900"
      justifyContent="space-between"
      onClick={() => {
        trackUseViewMore();
        onViewMore();
      }}
      rounded={8}
    >
      <TableTitle mb={0} title="Voted Proposals" count={answers?.all ?? 0} />
      <CustomIcon m={0} name="chevron-right" boxSize={6} color="gray.600" />
    </Flex>
  ) : (
    <Flex gap={6} direction="column">
      <TableTitle mb={0} title="Voted Proposals" count={answers?.all ?? 0} />
      {!onViewMore && (
        <>
          <Alert display={{ base: "none", md: "flex" }} gap={4} variant="info">
            <CustomIcon name="info-circle" boxSize={4} />
            <Text variant="body2" color="text.dark">
              Kindly note that the validator may not have voted on the proposal
              due to ineligibility, such as being recently added to the network.
            </Text>
          </Alert>
          <Grid gap={4} templateColumns={{ base: "1fr", md: "240px auto" }}>
            <GridItem>
              <SelectInputBase<ProposalVoteType>
                disableMaxH
                initialSelected={answerFilter}
                formLabel="Filter by vote answer"
                labelBgColor="background.main"
                onChange={handleOnAnswerFilterChange}
                options={answerOptions}
                popoverBgColor="gray.800"
              />
            </GridItem>
            <GridItem>
              <InputWithIcon
                size="lg"
                value={search}
                amptrackSection="voted-proposals-search"
                onChange={handleOnSearchChange}
                placeholder="Search with proposal ID or proposal title..."
              />
            </GridItem>
          </Grid>
        </>
      )}
      <VotedProposalsTableBody
        data={data}
        search={search}
        isLoading={isLoading}
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
                pageSize={pageSize}
                pagesQuantity={pagesQuantity}
                offset={offset}
                onPageChange={setCurrentPage}
                onPageSizeChange={(e) => {
                  const size = Number(e.target.value);
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                scrollComponentId={scrollComponentId}
                totalData={data.total}
              />
            ))}
    </Flex>
  );
};
