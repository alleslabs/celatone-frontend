import type { BechAddr32 } from "lib/types";

import { useInternalNavigate } from "lib/app-provider";
import { AlertPaginationRest } from "lib/components/AlertPaginationRest";
import { LoadNext } from "lib/components/LoadNext";
import { ContractsTable, TableTitle } from "lib/components/table";
import { useCodeContractsRest } from "lib/pages/code-details/data";
import { observer } from "mobx-react-lite";

import { NoContracts } from "./NoContracts";

interface CodeContractsTableLiteProps {
  codeId: number;
}

export const CodeContractsTableLite = observer(
  ({ codeId }: CodeContractsTableLiteProps) => {
    const navigate = useInternalNavigate();
    const {
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
    } = useCodeContractsRest(codeId);

    const onRowSelect = (contract: BechAddr32) =>
      navigate({
        pathname: "/contracts/[contract]",
        query: { contract },
      });

    return (
      <>
        {data && !!error && <AlertPaginationRest />}
        <TableTitle showCount={false} title="Contract instances" />
        <ContractsTable
          contracts={data}
          emptyState={<NoContracts />}
          isLoading={isLoading}
          showLastUpdate={false}
          onRowSelect={onRowSelect}
        />
        {hasNextPage && (
          <LoadNext
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            text="Load more contracts"
          />
        )}
      </>
    );
  }
);
