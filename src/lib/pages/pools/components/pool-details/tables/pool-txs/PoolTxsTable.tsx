import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { AssetInfos, Option, PoolDetail, Transaction } from "lib/types";

import { PoolTxsTableHeader } from "./PoolTxsTableHeader";
import { PoolTxsTableRow } from "./PoolTxsTableRow";

const TEMPLATE_COLUMNS =
  "24px max(200px) 50px minmax(360px, 1fr) max(160px) max(220px)";

interface PoolTxsTableProps {
  pool: PoolDetail;
  transactions: Option<Transaction[]>;
  assetInfos: Option<AssetInfos>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const PoolTxsTable = ({
  pool,
  transactions,
  assetInfos,
  isLoading,
  emptyState,
}: PoolTxsTableProps) => {
  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  return (
    <TableContainer>
      <PoolTxsTableHeader templateColumns={TEMPLATE_COLUMNS} />
      {transactions.map((transaction) => (
        <PoolTxsTableRow
          key={transaction.hash}
          pool={pool}
          transaction={transaction}
          assetInfos={assetInfos}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};
