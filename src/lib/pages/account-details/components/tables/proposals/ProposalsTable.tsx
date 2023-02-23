import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";

import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state/EmptyState";
import { TableContainer } from "lib/components/table";
import {
  ProposalsTableHeader,
  ProposalsTableRow,
} from "lib/components/table/proposals";
import { TableTitle } from "lib/components/table/TableTitle";
import { ViewMore } from "lib/components/table/ViewMore";
import { useProposalsByWalletAddressPagination } from "lib/services/proposalService";
import type { HumanAddr, Option } from "lib/types";

interface ProposalsTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

const ProposalsTableBody = observer(
  ({
    walletAddress,
    scrollComponentId,
    totalData,
    refetchCount,
    onViewMore,
  }: ProposalsTableProps) => {
    const {
      pagesQuantity,
      currentPage,
      setCurrentPage,
      pageSize,
      setPageSize,
      offset,
    } = usePaginator({
      total: totalData,
      initialState: {
        pageSize: 10,
        currentPage: 1,
        isDisabled: false,
      },
    });
    const { data: proposals, isLoading } =
      useProposalsByWalletAddressPagination(
        walletAddress,
        offset,
        onViewMore ? 5 : pageSize
      );

    const onPageChange = (nextPage: number) => {
      refetchCount();
      setCurrentPage(nextPage);
    };

    const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const size = Number(e.target.value);
      refetchCount();
      setPageSize(size);
      setCurrentPage(1);
    };

    const templateColumns =
      "100px minmax(300px, 1fr) 150px 330px 180px 160px 160px";

    if (isLoading) return <Loading />;
    if (!proposals?.length)
      return (
        <Flex
          py="64px"
          direction="column"
          borderY="1px solid"
          borderColor="pebble.700"
        >
          <EmptyState message="This account did not open any proposals before." />
        </Flex>
      );
    return (
      <>
        <TableContainer>
          <ProposalsTableHeader templateColumns={templateColumns} />
          {proposals.map((proposal) => (
            <ProposalsTableRow
              key={proposal.proposalId}
              proposal={proposal}
              templateColumns={templateColumns}
            />
          ))}
        </TableContainer>
        {totalData &&
          (onViewMore
            ? totalData > 5 && <ViewMore onClick={onViewMore} />
            : totalData > 10 && (
                <Pagination
                  currentPage={currentPage}
                  pagesQuantity={pagesQuantity}
                  offset={offset}
                  totalData={totalData}
                  scrollComponentId={scrollComponentId}
                  pageSize={pageSize}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                />
              ))}
      </>
    );
  }
);

export const ProposalsTable = ({
  totalData,
  ...componentProps
}: ProposalsTableProps) => (
  <Box mt={12} mb={4}>
    <TableTitle title="Opened Proposals" count={totalData ?? 0} />
    <ProposalsTableBody totalData={totalData} {...componentProps} />
  </Box>
);
