import type { BechAddr, Option } from "lib/types";
import type { ChangeEvent } from "react";

import { Box } from "@chakra-ui/react";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ErrorFetching } from "lib/components/state";
import { CodesTable, MobileTitle, ViewMore } from "lib/components/table";
import { useAccountCodes } from "lib/pages/account-details/data";
import { observer } from "mobx-react-lite";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";

interface StoredCodesTableProps {
  address: BechAddr;
  onViewMore?: () => void;
  refetchCount: () => void;
  scrollComponentId: string;
  totalData: Option<number>;
}

export const StoredCodesTable = observer(
  ({
    address,
    onViewMore,
    refetchCount,
    scrollComponentId,
    totalData,
  }: StoredCodesTableProps) => {
    const isMobile = useMobile();
    const navigate = useInternalNavigate();
    const onRowSelect = (codeId: number) =>
      navigate({
        pathname: "/codes/[codeId]",
        query: { codeId },
      });

    const {
      currentPage,
      offset,
      pageSize,
      pagesQuantity,
      setCurrentPage,
      setPageSize,
    } = usePaginator({
      initialState: {
        currentPage: 1,
        isDisabled: false,
        pageSize: 10,
      },
      total: totalData,
    });
    const { codes, isLoading } = useAccountCodes(
      address,
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
            count={totalData}
            title="Stored codes"
            onViewMore={onViewMore}
          />
        ) : (
          <AccountSectionWrapper
            hasHelperText={!!codes?.length}
            helperText="This account stored the following codes"
            title="Stored codes"
            totalData={totalData}
          >
            <CodesTable
              codes={codes}
              emptyState={
                !codes ? (
                  <ErrorFetching
                    dataName="codes"
                    hasBorderTop={false}
                    my={2}
                    withBorder
                  />
                ) : (
                  <AccountDetailsEmptyState message="No codes have been stored by this account before." />
                )
              }
              isLoading={isLoading}
              onRowSelect={onRowSelect}
            />
          </AccountSectionWrapper>
        )}
        {!!totalData &&
          (onViewMore
            ? totalData > 5 && !isMobile && <ViewMore onClick={onViewMore} />
            : totalData > 10 && (
                <Pagination
                  currentPage={currentPage}
                  offset={offset}
                  pageSize={pageSize}
                  pagesQuantity={pagesQuantity}
                  scrollComponentId={scrollComponentId}
                  totalData={totalData}
                  onPageChange={onPageChange}
                  onPageSizeChange={onPageSizeChange}
                />
              ))}
      </Box>
    );
  }
);
