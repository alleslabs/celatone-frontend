import { Alert, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

import { useMobile } from "lib/app-provider";
import { SelectInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableTitle, ViewMore } from "lib/components/table";
import { useDebounce } from "lib/hooks";
import { useValidatorVotedProposals } from "lib/services/validatorService";
import { ProposalVoteType } from "lib/types";
import type { ValidatorAddr } from "lib/types";

import { VotedProposalsTableBody } from "./VotedProposalsTableBody";

const scrollComponentId = "voted-proposals-table-header";

interface VotedProposalsTableProps {
  validatorAddress: ValidatorAddr;
  onViewMore?: () => void;
}

export const VotedProposalsTable = ({
  validatorAddress,
  onViewMore,
}: VotedProposalsTableProps) => {
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
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

  const { data, isLoading } = useValidatorVotedProposals(
    validatorAddress,
    onViewMore ? 5 : pageSize,
    offset,
    answerFilter,
    debouncedSearch,
    { onSuccess: ({ total }) => setTotalData(total) }
  );

  const answerOptions = useMemo(
    () => [
      {
        label: `All votes`,
        value: ProposalVoteType.ALL,
        disabled: false,
      },
      {
        label: `Yes`,
        value: ProposalVoteType.YES,
        disabled: false,
      },
      {
        label: `No`,
        value: ProposalVoteType.NO,
        disabled: false,
      },
      {
        label: `No with veto`,
        value: ProposalVoteType.NO_WITH_VETO,
        disabled: false,
      },
      {
        label: `Abstain`,
        value: ProposalVoteType.ABSTAIN,
        disabled: false,
      },
      {
        label: `Weighted`,
        value: ProposalVoteType.WEIGHTED,
        disabled: false,
      },
      {
        label: `Did not vote`,
        value: ProposalVoteType.DID_NOT_VOTE,
        disabled: false,
      },
    ],
    []
  );

  const handleOnSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setSearch(e.target.value);
  };

  const handleOnAnswerFilterChange = (newAnswer: ProposalVoteType) => {
    setCurrentPage(1);
    setAnswerFilter(newAnswer);
  };

  return isMobileOverview ? (
    <Flex
      backgroundColor="gray.900"
      p={4}
      rounded={8}
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      onClick={onViewMore}
    >
      <TableTitle title="Voted Proposals" count={data?.total ?? 0} mb={0} />
      <CustomIcon boxSize={6} m={0} name="chevron-right" color="gray.600" />
    </Flex>
  ) : (
    <Flex direction="column" gap={6}>
      <TableTitle title="Voted Proposals" count={data?.total ?? 0} mb={0} />
      {!onViewMore && (
        <>
          <Alert variant="info" gap={4} display={{ base: "none", md: "flex" }}>
            <CustomIcon boxSize={4} name="info-circle-solid" />
            <Text variant="body2" color="text.dark">
              Kindly note that the validator may not have voted on the proposal
              due to ineligibility, such as being recently added to the network.
            </Text>
          </Alert>
          <Grid gap={4} templateColumns={{ base: "1fr", md: "240px auto" }}>
            <GridItem>
              <SelectInput<ProposalVoteType>
                formLabel="Filter by vote answer"
                options={answerOptions}
                onChange={handleOnAnswerFilterChange}
                labelBgColor="background.main"
                initialSelected={answerFilter}
                popoverBgColor="gray.800"
                disableMaxH
              />
            </GridItem>
            <GridItem>
              <InputWithIcon
                placeholder="Search with proposal ID or proposal title..."
                value={search}
                onChange={handleOnSearchChange}
                size="lg"
              />
            </GridItem>
          </Grid>
        </>
      )}
      <VotedProposalsTableBody
        data={data}
        isLoading={isLoading}
        onViewMore={onViewMore}
      />
      {data &&
        (onViewMore
          ? data.total > 5 && (
              <ViewMore
                text={`View all proposed blocks (${data.total})`}
                onClick={onViewMore}
              />
            )
          : data.total > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={data.total}
                scrollComponentId={scrollComponentId}
                pageSize={pageSize}
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
