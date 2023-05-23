import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { Option, PoolDetail, Transaction } from "lib/types";

import { PoolTxsTableHeader } from "./PoolTxsTableHeader";
import { PoolTxsTableRow } from "./PoolTxsTableRow";

interface PoolTxsTableProps {
  pool: PoolDetail;
  transactions: Option<Transaction[]>;
  assetInfos: AssetInfosOpt;
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

  const templateColumns =
    "25px 180px 40px minmax(360px, 1fr) max(160px) max(220px)";

  return (
    <TableContainer>
      <PoolTxsTableHeader templateColumns={templateColumns} />
      {transactions.map((transaction) => (
        <PoolTxsTableRow
          key={transaction.hash}
          pool={pool}
          transaction={transaction}
          assetInfos={assetInfos}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
