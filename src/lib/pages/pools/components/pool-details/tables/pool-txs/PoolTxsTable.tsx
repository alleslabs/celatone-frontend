import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { Option, Transaction } from "lib/types";

import { PoolTxsTableHeader } from "./PoolTxsTableHeader";
import { PoolTxsTableRow } from "./PoolTxsTableRow";

interface PoolTxsTableProps {
  transactions: Option<Transaction[]>;
  assetInfos: AssetInfosOpt;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const PoolTxsTable = ({
  transactions,
  assetInfos,
  isLoading,
  emptyState,
}: PoolTxsTableProps) => {
  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  const templateColumns =
    "180px 40px minmax(360px, 1fr) max(150px) max(220px) 60px";

  return (
    <TableContainer>
      <PoolTxsTableHeader templateColumns={templateColumns} />
      {transactions.map((transaction) => (
        <PoolTxsTableRow
          key={transaction.hash}
          transaction={transaction}
          assetInfos={assetInfos}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
