import type { Transaction } from "lib/types";

import { PoolTxsTableRow } from "./PoolTxsTableRow";

interface PoolTxsTableMultiRowProps {
  transaction: Transaction;
  templateColumns: string;
}

export const PoolTxsTableMultiRow = ({
  transaction,
  templateColumns,
}: PoolTxsTableMultiRowProps) => (
  <>
    {transaction.messages.map((message, index) => (
      <PoolTxsTableRow
        key={transaction.hash + index.toString()}
        txHash={!index ? transaction.hash : undefined}
        msgCount={transaction.messages.length}
        message={message}
        sender={transaction.sender}
        created={!index ? transaction.created : undefined}
        templateColumns={templateColumns}
      />
    ))}
  </>
);
