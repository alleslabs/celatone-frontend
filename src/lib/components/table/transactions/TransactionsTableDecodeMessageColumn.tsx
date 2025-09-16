import type { DecodedTx } from "@initia/tx-decoder";
import type { TxResponse } from "lib/services/types";
import type { Option, TransactionWithTxResponse } from "lib/types";

import { Spinner } from "@chakra-ui/react";
import { ActionMessages } from "lib/components/action-msg/ActionMessages";
import { DecodeMessage } from "lib/components/decode-message";

interface TransactionsTableDecodeMessageColumnProps {
  decodedTx: Option<DecodedTx>;
  isDecodedTxFetching: boolean;
  transaction: TransactionWithTxResponse;
  txResponse: Option<TxResponse>;
}

const DecodeMessageColumn = ({
  decodedTx,
  transaction,
  txResponse,
}: Omit<TransactionsTableDecodeMessageColumnProps, "isDecodedTxFetching">) => {
  if (txResponse && decodedTx && decodedTx.messages.length > 0) {
    const isMsgUpdateClientWithIbcTransfer =
      decodedTx?.messages.length === 2 &&
      txResponse.tx.body.messages[0]["@type"] ===
        "/ibc.core.client.v1.MsgUpdateClient" &&
      decodedTx?.messages[1].decodedMessage.action === "ibc_ft_receive";

    const index = isMsgUpdateClientWithIbcTransfer ? 1 : 0;

    return (
      <DecodeMessage
        compact
        decodedMessage={decodedTx.messages[index].decodedMessage}
        log={undefined}
        metadata={decodedTx.metadata}
        msgBody={txResponse.tx.body.messages[index]}
        msgCount={txResponse.tx.body.messages.length}
      />
    );
  }

  return <ActionMessages transaction={transaction} />;
};

export const TransactionsTableDecodeMessageColumn = ({
  decodedTx,
  isDecodedTxFetching,
  transaction,
  txResponse,
}: TransactionsTableDecodeMessageColumnProps) => {
  return isDecodedTxFetching ? (
    <Spinner boxSize={4} />
  ) : (
    <DecodeMessageColumn
      decodedTx={decodedTx}
      transaction={transaction}
      txResponse={txResponse}
    />
  );
};
