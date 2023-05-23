import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail, Transaction } from "lib/types";

import { extractPoolMsgs } from "./messages/utils";
import { PoolTxsMsg } from "./PoolTxsMsg";

interface PoolTxsTableRowProps {
  pool: PoolDetail;
  transaction: Transaction;
  assetInfos: AssetInfosOpt;
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
          msgIndex={0}
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
          msgIndex={Number(hasOtherMsgs) + index}
          otherMsgs={others}
          message={message}
          pool={pool}
          transaction={transaction}
          assetInfos={assetInfos}
          templateColumns={templateColumns}
        />
      ))}
    </>
  );
};
