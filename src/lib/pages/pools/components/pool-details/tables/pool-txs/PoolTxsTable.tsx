import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { AssetInfos, Option, PoolData, Transaction } from "lib/types";

import { PoolTxsTableHeader } from "./PoolTxsTableHeader";
import { PoolTxsTableRow } from "./PoolTxsTableRow";

const TEMPLATE_COLUMNS =
  "24px max(200px) 50px minmax(360px, 1fr) max(160px) max(220px)";

interface PoolTxsTableProps {
  assetInfos: Option<AssetInfos>;
  emptyState: JSX.Element;
  isLoading: boolean;
  pool: PoolData;
  transactions: Option<Transaction[]>;
}

export const PoolTxsTable = ({
  assetInfos,
  emptyState,
  isLoading,
  pool,
  transactions,
}: PoolTxsTableProps) => {
  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  return (
    <TableContainer>
      <PoolTxsTableHeader templateColumns={TEMPLATE_COLUMNS} />
      {transactions.map((transaction) => (
        <PoolTxsTableRow
          key={transaction.hash}
          assetInfos={assetInfos}
          pool={pool}
          templateColumns={TEMPLATE_COLUMNS}
          transaction={transaction}
        />
      ))}
    </TableContainer>
  );
};
