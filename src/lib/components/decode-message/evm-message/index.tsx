import type {
  DecodedEthereumCall,
  DecodedEthereumTx,
  DecodedMessage,
  DecodedNotSupportedCall,
} from "@initia/tx-decoder";

import { lazy } from "react";

import { type TxMsgData } from "../../tx-message";

// Lazy load all decode message components for better code splitting
const DecodeEvmMessageNotSupportedHeader = lazy(() =>
  import("./decode-evm-message-not-supported").then((m) => ({
    default: m.DecodeEvmMessageNotSupportedHeader,
  }))
);

const DecodeEvmMessageNotSupportedBody = lazy(() =>
  import("./decode-evm-message-not-supported").then((m) => ({
    default: m.DecodeEvmMessageNotSupportedBody,
  }))
);

interface DecodeCosmosEvmMessageProps extends TxMsgData {
  compact: boolean;
  decodedMessage: DecodedMessage;
  evmDecodedMessage: DecodedEthereumTx;
}

const isNotSupportedCall = (
  call: DecodedEthereumCall
): call is DecodedNotSupportedCall => call.action === "not_supported";

export const DecodeCosmosEvmMessageHeader = ({
  decodedMessage,
  evmDecodedMessage,
  ...props
}: DecodeCosmosEvmMessageProps) => {
  const { decodedTransaction } = evmDecodedMessage;

  if (isNotSupportedCall(decodedTransaction)) {
    return (
      <DecodeEvmMessageNotSupportedHeader
        decodedMessage={decodedMessage}
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  return null;
};

export const DecodeCosmosEvmMessageBody = ({
  decodedMessage,
  evmDecodedMessage,
  ...props
}: DecodeCosmosEvmMessageProps) => {
  const { decodedTransaction } = evmDecodedMessage;

  if (isNotSupportedCall(decodedTransaction)) {
    return (
      <DecodeEvmMessageNotSupportedBody
        decodedMessage={decodedMessage}
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  return null;
};
