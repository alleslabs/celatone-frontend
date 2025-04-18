import type { BechAddr32 } from "lib/types";

import { useInternalNavigate } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ContractsTable } from "lib/components/table";
import { observer } from "mobx-react-lite";

import { useRecentContracts } from "../data";

export const RecentContractsTable = observer(() => {
  const navigate = useInternalNavigate();
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
  const { data, isLoading } = useRecentContracts(
    pageSize,
    offset,
    setTotalData
  );

  const onRowSelect = (contract: BechAddr32) =>
    navigate({
      pathname: "/contracts/[contract]",
      query: { contract },
    });

  return (
    <>
      <ContractsTable
        contracts={data?.items}
        emptyState={
          data ? (
            <EmptyState
              imageVariant="empty"
              message="This network does not have any contracts."
              withBorder
            />
          ) : (
            <ErrorFetching dataName="contracts" />
          )
        }
        isLoading={isLoading}
        showTag={false}
        onRowSelect={onRowSelect}
      />
      {data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={data.total}
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
});
