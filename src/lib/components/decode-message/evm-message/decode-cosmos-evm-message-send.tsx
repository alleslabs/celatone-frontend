import type { DecodedMessage } from "@initia/tx-decoder";
import type { TxMsgData } from "lib/components/tx-message";

import { Flex } from "@chakra-ui/react";
import { DecodeMessageHeader } from "lib/components/decode-message/decode-message-header";

import {
  DecodeMessageSendBody,
  DecodeMessageSendHeader,
} from "../common-decode-message/decode-message-send";

interface DecodeCosmosEvmMessageSendProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "send";
  };
}

export const DecodeCosmosEvmMessageSendHeader = ({
  compact,
  decodedMessage,
  msgBody,
  msgCount,
}: DecodeCosmosEvmMessageSendProps) => {
  const { isIbc, isOp } = decodedMessage;

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        className=""
        compact={compact}
        gap={2}
        isExpand
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={msgCount === 1}
        label="Send"
        msgCount={msgCount}
        type={msgBody["@type"]}
      >
        <DecodeMessageSendHeader
          compact={compact}
          decodedMessage={decodedMessage}
        />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeCosmosEvmMessageSendBody = ({
  ...props
}: DecodeCosmosEvmMessageSendProps) => {
  return <DecodeMessageSendBody {...props} />;
};
