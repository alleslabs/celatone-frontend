import { observer } from "mobx-react-lite";

import { useInternalNavigate } from "lib/app-provider";
import { AlertPaginationRest } from "lib/components/AlertPaginationRest";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { CodesTable } from "lib/components/table";
import { useRecentCodesRest } from "../data";

export const RecentCodesTableLite = observer(() => {
  const navigate = useInternalNavigate();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
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
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This network does not have any codes."
            withBorder
          />
        }
        onRowSelect={onRowSelect}
        showCw2andContracts={false}
      />
      {hasNextPage && (
        <LoadNext
          text="Load more 10 codes"
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
});
