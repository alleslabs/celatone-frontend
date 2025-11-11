import { useInternalNavigate } from "lib/app-provider";
import { AlertPaginationRest } from "lib/components/AlertPaginationRest";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { CodesTable } from "lib/components/table";
import { observer } from "mobx-react-lite";

import { useRecentCodesRest } from "../data";

export const RecentCodesTableLite = observer(() => {
  const navigate = useInternalNavigate();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useRecentCodesRest();

  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });

  return (
    <>
      {data && !!error && <AlertPaginationRest />}
      <CodesTable
        codes={data}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This network does not have any codes."
            withBorder
          />
        }
        isLoading={isLoading}
        showCw2andContracts={false}
        onRowSelect={onRowSelect}
      />
      {hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more codes"
        />
      )}
    </>
  );
});
