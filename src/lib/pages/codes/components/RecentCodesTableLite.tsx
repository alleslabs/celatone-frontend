import { observer } from "mobx-react-lite";

import { useRecentCodesLcd } from "../data";
import { useInternalNavigate } from "lib/app-provider";
import { AlertPaginationLcd } from "lib/components/AlertPaginationLcd";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { CodesTable } from "lib/components/table";

export const RecentCodesTableLite = observer(() => {
  const navigate = useInternalNavigate();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useRecentCodesLcd();

  const onRowSelect = (codeId: number) =>
    navigate({
      pathname: "/codes/[codeId]",
      query: { codeId },
    });

  return (
    <>
      {data && !!error && <AlertPaginationLcd />}
      <CodesTable
        emptyState={
          <EmptyState
            imageVariant="empty"
            message="This network does not have any codes."
            withBorder
          />
        }
        codes={data}
        isLoading={isLoading}
        onRowSelect={onRowSelect}
        showCw2andContracts={false}
      />
      {hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more 10 codes"
        />
      )}
    </>
  );
});
