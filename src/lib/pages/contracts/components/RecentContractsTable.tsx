import { observer } from "mobx-react-lite";

import { useRecentContracts } from "../data";
import { useInternalNavigate } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ContractsTable } from "lib/components/table";
import type { BechAddr32 } from "lib/types";

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
        contracts={data?.items}
        isLoading={isLoading}
        onRowSelect={onRowSelect}
        showTag={false}
      />
      {data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
          totalData={data.total}
        />
      )}
    </>
  );
});
