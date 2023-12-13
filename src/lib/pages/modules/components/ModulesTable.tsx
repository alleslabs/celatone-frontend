import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { ModulesTable as ModulesTableComponent } from "lib/components/table";
import { useModules } from "lib/services/move";

interface ModulesTableProps {
  isViewMore: boolean;
}

export const ModulesTable = ({ isViewMore }: ModulesTableProps) => {
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
      pageSize: isViewMore ? 5 : 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data, isLoading, error } = useModules(pageSize, offset, {
    onSuccess: ({ total }) => setTotalData(total),
  });

  return (
    <>
      <ModulesTableComponent
        modules={data?.items}
        isLoading={isLoading}
        emptyState={
          error ? (
            <EmptyState
              withBorder
              imageVariant="not-found"
              message="There is an error during fetching recent modules."
            />
          ) : (
            <EmptyState
              withBorder
              imageVariant="empty"
              message="There are no transactions on this network."
            />
          )
        }
      />
      {!isViewMore && data && data.total > 10 && (
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
