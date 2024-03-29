import { Alert, Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import {
  MobileTableContainer,
  TableContainer,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import type { ValidatorVotedProposalsResponse } from "lib/services/validator";
import { useValidatorVotedProposals } from "lib/services/validatorService";
import type { ValidatorAddr } from "lib/types";

import { VotedProposalsTableRow } from "./VotedProposalsRow";
import { VotedProposalsTableHeader } from "./VotedProposalsTableHeader";
import { VotedProposalsTableMobileCard } from "./VotedProposalsTableMobileCard";

const templateColumns =
  "100px minmax(360px, 2fr) 150px 150px minmax(330px, 1fr)";
const boxShadow = "16px 0 32px -10px";
const scrollComponentId = "voted-proposals-table-header";

interface VotedProposalsTableBodyProps {
  data: ValidatorVotedProposalsResponse;
  onViewMore?: () => void;
  isMobile: boolean;
  currentPage: number;
  offset: number;
  pageSize: number;
  pagesQuantity: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const VotedProposalsTableBody = ({
  data,
  onViewMore,
  isMobile,
  currentPage,
  offset,
  pageSize,
  pagesQuantity,
  setCurrentPage,
  setPageSize,
}: VotedProposalsTableBodyProps) => (
  <Flex direction="column" gap={6}>
    {!onViewMore && (
      <Alert variant="info" gap={4} display={{ base: "none", md: "flex" }}>
        <CustomIcon boxSize={4} name="info-circle-solid" />
        <Text variant="body2" color="text.dark">
          Kindly note that the validator may not have voted on the proposal due
          to ineligibility, such as being recently added to the network.
        </Text>
      </Alert>
    )}
    {isMobile ? (
      <MobileTableContainer>
        {data.items.map((votedProposal) => (
          <VotedProposalsTableMobileCard
            key={votedProposal.id}
            votedProposal={votedProposal}
          />
        ))}
      </MobileTableContainer>
    ) : (
      <TableContainer>
        <VotedProposalsTableHeader
          templateColumns={templateColumns}
          boxShadow={boxShadow}
        />
        {data.items.map((votedProposal) => (
          <VotedProposalsTableRow
            key={votedProposal.id}
            votedProposal={votedProposal}
            templateColumns={templateColumns}
            boxShadow={boxShadow}
          />
        ))}
        {onViewMore && data.total > 5 && (
          <ViewMore
            onClick={onViewMore}
            text={`View all proposed blocks (${data.total})`}
          />
        )}
      </TableContainer>
    )}
    {!onViewMore && data.total > 10 && (
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
    )}
  </Flex>
);

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

  const { data, isLoading, error } = useValidatorVotedProposals(
    validatorAddress,
    onViewMore ? 5 : pageSize,
    offset,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  if (isLoading) return <Loading />;
  if (error || !data) return <ErrorFetching dataName="voted proposals" />;
  if (!data.total)
    return (
      <>
        <TableTitle title="Voted Proposals" count={0} mb={0} />
        <EmptyState
          imageVariant={onViewMore ? undefined : "empty"}
          message="This validator had no eligibility to cast votes on any proposals."
          withBorder
        />
      </>
    );

  return (
    <Flex direction="column" gap={6}>
      {isMobileOverview ? (
        <Flex
          backgroundColor="gray.900"
          p={4}
          rounded={8}
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          onClick={onViewMore}
        >
          <TableTitle title="Voted Proposals" count={data.total} mb={0} />
          <CustomIcon boxSize={6} m={0} name="chevron-right" color="gray.600" />
        </Flex>
      ) : (
        <TableTitle title="Voted Proposals" count={data.total} mb={0} />
      )}
      {(!isMobile || !onViewMore) && (
        <VotedProposalsTableBody
          data={data}
          onViewMore={onViewMore}
          isMobile={isMobile}
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
        />
      )}
    </Flex>
  );
};
