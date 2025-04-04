import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { ErrorFetching } from "lib/components/state";
import { CodesTable, MobileTitle, ViewMore } from "lib/components/table";
import { useAccountCodes } from "lib/pages/account-details/data";
import type { BechAddr, Option } from "lib/types";
import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";

interface StoredCodesTableProps {
  address: BechAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const StoredCodesTable = observer(
  ({
    address,
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
            title="Stored codes"
            count={totalData}
            onViewMore={onViewMore}
          />
        ) : (
          <AccountSectionWrapper
            title="Stored codes"
            totalData={totalData}
            hasHelperText={!!codes?.length}
            helperText="This account stored the following codes"
          >
            <CodesTable
              codes={codes}
              isLoading={isLoading}
              emptyState={
                !codes ? (
                  <ErrorFetching
                    dataName="codes"
                    withBorder
                    my={2}
                    hasBorderTop={false}
                  />
                ) : (
                  <AccountDetailsEmptyState message="No codes have been stored by this account before." />
                )
              }
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
