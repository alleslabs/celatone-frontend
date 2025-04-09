import { observer } from "mobx-react-lite";

import { useInternalNavigate } from "lib/app-provider";
import { AlertPaginationRest } from "lib/components/AlertPaginationRest";
import { LoadNext } from "lib/components/LoadNext";
import { ContractsTable, TableTitle } from "lib/components/table";
import { useCodeContractsRest } from "lib/pages/code-details/data";
import type { BechAddr32 } from "lib/types";

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
      isLoading,
      isFetchingNextPage,
    } = useCodeContractsRest(codeId);

    const onRowSelect = (contract: BechAddr32) =>
      navigate({
        pathname: "/contracts/[contract]",
        query: { contract },
      });

    return (
      <>
        {data && !!error && <AlertPaginationRest />}
        <TableTitle title="Contract instances" showCount={false} />
        <ContractsTable
          contracts={data}
          isLoading={isLoading}
          emptyState={<NoContracts />}
          onRowSelect={onRowSelect}
          showLastUpdate={false}
        />
        {hasNextPage && (
          <LoadNext
            text="Load more 10 contracts"
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </>
    );
  }
);
