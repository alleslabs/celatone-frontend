import type { DecodedMessage } from "@initia/tx-decoder";

import { lazy } from "react";

import { type TxMsgData } from "../../tx-message";

// Lazy load all decode message components for better code splitting
const DecodeCosmosEvmMessageSendHeader = lazy(() =>
  import("./decode-cosmos-evm-message-send").then((m) => ({
    default: m.DecodeCosmosEvmMessageSendHeader,
  }))
);

const DecodeCosmosEvmMessageSendBody = lazy(() =>
  import("./decode-cosmos-evm-message-send").then((m) => ({
    default: m.DecodeCosmosEvmMessageSendBody,
  }))
);

interface DecodeCosmosEvmMessageProps extends TxMsgData {
  compact: boolean;
  decodedMessage: DecodedMessage;
}

export const DecodeCosmosEvmMessageHeader = ({
  decodedMessage,
  ...props
}: DecodeCosmosEvmMessageProps) => {
  const renderMessage = () => {
    switch (decodedMessage.action) {
      case "send":
        return (
          <DecodeCosmosEvmMessageSendHeader
            decodedMessage={decodedMessage}
            {...props}
          />
        );
      default:
        return null;
    }
  };

  return renderMessage();
};

export const DecodeCosmosEvmMessageBody = ({
  decodedMessage,
  ...props
}: DecodeCosmosEvmMessageProps) => {
  const renderMessage = () => {
    switch (decodedMessage.action) {
      case "send":
        return (
          <DecodeCosmosEvmMessageSendBody
            decodedMessage={decodedMessage}
            {...props}
            compact={false}
            log={undefined}
          />
        );
      default:
        return null;
    }
  };

  return renderMessage();
};
