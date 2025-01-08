import type { AssetInfos, Option, PoolData, Transaction } from "lib/types";

import { extractPoolMsgs } from "./messages/utils";
import { PoolTxsMsg } from "./PoolTxsMsg";

interface PoolTxsTableRowProps {
  pool: PoolData;
  transaction: Transaction;
  assetInfos: Option<AssetInfos>;
  templateColumns: string;
}

export const PoolTxsTableRow = ({
  pool,
  transaction,
  assetInfos,
  templateColumns,
}: PoolTxsTableRowProps) => {
  const { msgs: filteredMsgs, others } = extractPoolMsgs(
    transaction.messages,
    pool.id
  );
  const hasOtherMsgs = Object.values(others).some((count) => count > 0);
  return (
    <>
      {hasOtherMsgs && (
        <PoolTxsMsg
          key={`${transaction.hash}0`}
          isFirstSubRow
          msgIndex={-1}
          otherMsgs={others}
          message={undefined}
          pool={pool}
          transaction={transaction}
          assetInfos={assetInfos}
          templateColumns={templateColumns}
        />
      )}
      {filteredMsgs.map((message, index) => (
        <PoolTxsMsg
          key={transaction.hash + Number(hasOtherMsgs) + index.toString()}
          isFirstSubRow={!hasOtherMsgs && index === 0}
          msgIndex={message.index}
          otherMsgs={others}
          message={message.msg}
          pool={pool}
          transaction={transaction}
          assetInfos={assetInfos}
          templateColumns={templateColumns}
        />
      ))}
    </>
  );
};
