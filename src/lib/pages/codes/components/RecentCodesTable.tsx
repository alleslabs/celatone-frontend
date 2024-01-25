import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useRecentCodes } from "../data";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { CodesTable } from "lib/components/table";
import type { PermissionFilterValue } from "lib/hooks";

interface RecentCodesTableProps {
  permissionValue: PermissionFilterValue;
}

export const RecentCodesTable = observer(
  ({ permissionValue }: RecentCodesTableProps) => {
    const navigate = useInternalNavigate();
    const { address } = useCurrentChain();

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
    const { data, isLoading } = useRecentCodes(
      pageSize,
      offset,
      address,
      permissionValue,
      setTotalData
    );

    const onRowSelect = (codeId: number) =>
      navigate({
        pathname: "/codes/[codeId]",
        query: { codeId },
      });

    useEffect(() => {
      setCurrentPage(1);
      setPageSize(10);
    }, [permissionValue, setCurrentPage, setPageSize]);

    return (
      <>
        <CodesTable
          codes={data?.items}
          isLoading={isLoading}
          emptyState={
            data ? (
              <EmptyState
                imageVariant="empty"
                message="This network does not have any codes."
                withBorder
              />
            ) : (
              <ErrorFetching dataName="codes" />
            )
          }
          onRowSelect={onRowSelect}
        />
        {data && data.total > 10 && (
          <Pagination
            currentPage={currentPage}
            pagesQuantity={pagesQuantity}
            offset={offset}
            totalData={data.total}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(e) => {
              const size = Number(e.target.value);
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </>
    );
  }
);
