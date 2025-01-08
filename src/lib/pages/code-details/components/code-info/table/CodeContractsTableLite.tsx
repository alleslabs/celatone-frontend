import { observer } from "mobx-react-lite";

import { useInternalNavigate } from "lib/app-provider";
import { AlertPaginationLcd } from "lib/components/AlertPaginationLcd";
import { LoadNext } from "lib/components/LoadNext";
import { ContractsTable, TableTitle } from "lib/components/table";
import { useCodeContractsLcd } from "lib/pages/code-details/data";
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
      isFetchingNextPage,
      isLoading,
    } = useCodeContractsLcd(codeId);

    const onRowSelect = (contract: BechAddr32) =>
      navigate({
        pathname: "/contracts/[contract]",
        query: { contract },
      });

    return (
      <>
        {data && !!error && <AlertPaginationLcd />}
        <TableTitle title="Contract Instances" showCount={false} />
        <ContractsTable
          emptyState={<NoContracts />}
          contracts={data}
          isLoading={isLoading}
          onRowSelect={onRowSelect}
          showLastUpdate={false}
        />
        {hasNextPage && (
          <LoadNext
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            text="Load more 10 contracts"
          />
        )}
      </>
    );
  }
);
