import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { ErrorFetching } from "../../ErrorFetching";
import { MobileTitle } from "../../mobile/MobileTitle";
import { useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { TableTitle, ViewMore } from "lib/components/table";
import { useProposalsByWalletAddressPagination } from "lib/services/proposalService";
import type { HumanAddr, Option } from "lib/types";

import { OpenedProposalsBody } from "./OpenProposalsBody";

interface OpenedProposalsTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

const ProposalTitle = ({
  onViewMore,
  totalData,
}: {
  onViewMore: OpenedProposalsTableProps["onViewMore"];
  totalData: Option<number>;
}) => {
  const isMobile = useMobile();
  if (isMobile && onViewMore)
    return (
      <MobileTitle
        title="Opened Proposals"
        count={totalData ?? 0}
        onViewMore={onViewMore}
      />
    );
  return (
    <TableTitle
      title="Opened Proposals"
      count={totalData ?? 0}
      mb={{ base: 0, md: 2 }}
    />
  );
};
export const OpenedProposalsTable = ({
  walletAddress,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
}: OpenedProposalsTableProps) => {
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
  const { data: proposals, isLoading } = useProposalsByWalletAddressPagination(
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
  const isMobile = useMobile();
  let isMobileDetail = null;
  if (isMobile && onViewMore) {
    isMobileDetail = false;
  } else {
    isMobileDetail = true;
  }
  return (
    <Box mt={{ base: 4, md: 8 }}>
      <ProposalTitle totalData={totalData} onViewMore={onViewMore} />
      {isMobileDetail && (
        <OpenedProposalsBody
          proposals={proposals}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              message={
                !proposals ? (
                  <ErrorFetching />
                ) : (
                  "This account did not open any proposals before."
                )
              }
              withBorder
            />
          }
          onViewMore={onViewMore}
        />
      )}
      {!!totalData &&
        (onViewMore
          ? totalData > 5 && !isMobile && <ViewMore onClick={onViewMore} />
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
    </Box>
  );
};
