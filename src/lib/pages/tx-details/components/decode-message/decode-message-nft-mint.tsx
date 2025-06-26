import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";

interface DecodeMessageNftMintProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "nft_mint";
  };
}

export const DecodeMessageNftMint = ({
  decodedMessage,
  isSingleMsg,
  log,
  msgBody,
}: DecodeMessageNftMintProps) => {
  const [expand, setExpand] = useState(!!isSingleMsg);

  return (
    <Flex direction="column">
      <DecodeMessageHeader
        gap={2}
        iconName="send"
        isExpand={expand}
        isIbc={decodedMessage.isIbc}
        isSingleMsg={!!isSingleMsg}
        label="Send"
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        header
      </DecodeMessageHeader>
      <DecodeMessageBody isExpand={expand} log={log}>
        body
      </DecodeMessageBody>
    </Flex>
  );
};
