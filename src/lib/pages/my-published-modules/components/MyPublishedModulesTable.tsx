import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { ModulesTable } from "lib/components/table";
import { useModules } from "lib/services/move";

export const MyPublishedModulesTable = () => {
  const { setTotalData, pageSize, offset } = usePaginator({
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
    <ModulesTable
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
            message="There are no modules on this network yet."
          />
        )
      }
    />
  );
};
