import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TableContainer, TableTitle, ViewMore } from "lib/components/table";
import type { ValidatorVotedProposalsResponse } from "lib/services/validator";
import { useValidatorVotedProposals } from "lib/services/validatorService";
import type { ValidatorAddr } from "lib/types";

import { VotedProposalsTableRow } from "./VotedProposalsRow";
import { VotedProposalsTableHeader } from "./VotedProposalsTableHeader";

const templateColumns =
  "100px minmax(360px, 2fr) 150px 150px minmax(330px, 1fr)";
const boxShadow = "16px 0 32px -10px";

interface VotedProposalsTableBodyProps {
  data: ValidatorVotedProposalsResponse;
  onViewMore?: () => void;
  isMobile: boolean;
}

const VotedProposalsTableBody = ({
  data,
  onViewMore,
  isMobile,
}: VotedProposalsTableBodyProps) => (
  <>
    {isMobile ? (
      <div>Mobile</div>
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
  </>
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

  const { setTotalData, pageSize, offset } = usePaginator({
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
    <>
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
        />
      )}
    </>
  );
};
