import type { AssetInfosOpt } from "lib/services/assetService";
import type { Transaction } from "lib/types";

import { PoolTxsTableRow } from "./PoolTxsTableRow";

interface PoolTxsTableMultiRowProps {
  transaction: Transaction;
  assetInfos: AssetInfosOpt;
  templateColumns: string;
}

export const PoolTxsTableMultiRow = ({
  transaction,
  assetInfos,
  templateColumns,
}: PoolTxsTableMultiRowProps) => (
  <>
    {transaction.messages.map((message, index) => (
      <PoolTxsTableRow
        key={transaction.hash + index.toString()}
        msgIndex={index}
        message={message}
        transaction={transaction}
        assetInfos={assetInfos}
        templateColumns={templateColumns}
      />
    ))}
  </>
);
