import type { AssetInfos, Option, PoolData, Transaction } from "lib/types";

import { extractPoolMsgs } from "./messages/utils";
import { PoolTxsMsg } from "./PoolTxsMsg";

interface PoolTxsTableRowProps {
  assetInfos: Option<AssetInfos>;
  pool: PoolData;
  templateColumns: string;
  transaction: Transaction;
}

export const PoolTxsTableRow = ({
  assetInfos,
  pool,
  templateColumns,
  transaction,
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
          assetInfos={assetInfos}
          isFirstSubRow
          message={undefined}
          msgIndex={-1}
          otherMsgs={others}
          pool={pool}
          templateColumns={templateColumns}
          transaction={transaction}
        />
      )}
      {filteredMsgs.map((message, index) => (
        <PoolTxsMsg
          key={transaction.hash + Number(hasOtherMsgs) + index.toString()}
          assetInfos={assetInfos}
          isFirstSubRow={!hasOtherMsgs && index === 0}
          message={message.msg}
          msgIndex={message.index}
          otherMsgs={others}
          pool={pool}
          templateColumns={templateColumns}
          transaction={transaction}
        />
      ))}
    </>
  );
};
