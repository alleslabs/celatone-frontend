import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ModulesTable } from "lib/components/table";
import { useModules } from "lib/services/move";

export const RecentModulesTable = () => {
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
  const { data, isLoading, error } = useModules(pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

  return (
    <>
      <ModulesTable
        modules={data?.items}
        isLoading={isLoading}
        emptyState={
          error ? (
            <ErrorFetching message="There is an error during fetching recent modules." />
          ) : (
            <EmptyState
              withBorder
              imageVariant="empty"
              message="There are no modules on this network yet."
            />
          )
        }
        isPublishedModules={false}
      />
      {!!data && data.total > 10 && (
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
};
