import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";

import { ErrorFetching } from "../../../../components/state/ErrorFetching";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import {
  CodesTable,
  MobileTitle,
  TableTitle,
  ViewMore,
} from "lib/components/table";
import { useAccountCodes } from "lib/pages/account-details/data";
import type { HumanAddr, Option } from "lib/types";

interface StoredCodesTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const StoredCodesTable = observer(
  ({
    walletAddress,
    scrollComponentId,
    totalData,
    refetchCount,
    onViewMore,
  }: StoredCodesTableProps) => {
    const isMobile = useMobile();
    const navigate = useInternalNavigate();
    const onRowSelect = (codeId: number) =>
      navigate({
        pathname: "/codes/[codeId]",
        query: { codeId },
      });

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
    const { codes, isLoading } = useAccountCodes(
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

    const isMobileOverview = isMobile && !!onViewMore;
    return (
      <Box mt={{ base: 4, md: 8 }}>
        {isMobileOverview ? (
          <MobileTitle
            title="Stored Codes"
            count={totalData}
            onViewMore={onViewMore}
          />
        ) : (
          <>
            <TableTitle
              title="Stored Codes"
              count={totalData}
              mb={2}
              helperText="This account stored the following codes"
            />
            <CodesTable
              codes={codes}
              isLoading={isLoading}
              emptyState={
                !codes ? (
                  <ErrorFetching message="There is an error during fetching codes." />
                ) : (
                  <EmptyState
                    withBorder
                    imageVariant="empty"
                    message="This account did not stored any codes before."
                  />
                )
              }
              onRowSelect={onRowSelect}
            />
          </>
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
  }
);
