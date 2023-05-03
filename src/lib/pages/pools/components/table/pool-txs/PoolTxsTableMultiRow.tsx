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
}: PoolTxsTableMultiRowProps) => {
  let row = 0;
  return (
    <>
      {transaction.messages.map((message, index) => {
        row += 1;
        return (
          <PoolTxsTableRow
            key={transaction.hash + index.toString()}
            isFirstRow={row === 1}
            txHash={transaction.hash}
            success={transaction.success}
            msgCount={transaction.messages.length}
            message={message}
            sender={transaction.sender}
            created={transaction.created}
            msgIndex={index}
            blockHeight={transaction.height}
            assetInfos={assetInfos}
            templateColumns={templateColumns}
          />
        );
      })}
    </>
  );
};
