import { Flex } from "@chakra-ui/react";
import { memo, useState } from "react";

import type { DecodeMessageSendProps } from "../common-decode-message/decode-message-send";

import {
  DecodeMessageSendBody,
  DecodeMessageSendHeader,
} from "../common-decode-message/decode-message-send";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";

export const DecodeMessageSend = memo(
  ({
    compact,
    decodedMessage,
    log,
    msgBody,
    msgCount,
  }: DecodeMessageSendProps) => {
    const isSingleMsg = msgCount === 1;
    const [expand, setExpand] = useState(!!isSingleMsg);
    const { isIbc, isOp } = decodedMessage;

    return (
      <Flex direction="column" w="100%">
        <DecodeMessageHeader
          compact={compact}
          gap={2}
          isExpand={expand}
          isIbc={isIbc}
          isOpinit={isOp}
          isSingleMsg={!!isSingleMsg}
          label="Send"
          msgCount={msgCount}
          type={msgBody["@type"]}
          onClick={() => setExpand(!expand)}
        >
          <DecodeMessageSendHeader
            compact={compact}
            decodedMessage={decodedMessage}
          />
        </DecodeMessageHeader>
        <DecodeMessageBody compact={compact} log={log}>
          <DecodeMessageSendBody decodedMessage={decodedMessage} />
        </DecodeMessageBody>
      </Flex>
    );
  }
);
