import type { AssetInfosOpt } from "lib/services/assetService";
import type { Transaction } from "lib/types";

import { PoolTxsMsg } from "./PoolTxsMsg";

interface PoolTxsTableRowProps {
  transaction: Transaction;
  assetInfos: AssetInfosOpt;
  templateColumns: string;
}

export const PoolTxsTableRow = ({
  transaction,
  assetInfos,
  templateColumns,
}: PoolTxsTableRowProps) => (
  <>
    {transaction.messages.map((message, index) => (
      <PoolTxsMsg
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
