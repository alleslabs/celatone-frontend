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
  compact,
  decodedMessage,
  isSingleMsg,
  log,
  msgBody,
}: DecodeMessageNftMintProps) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { isIbc, isOp } = decodedMessage;

  return (
    <Flex direction="column">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        iconName="collection"
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="NFT Mint"
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        header
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        body
      </DecodeMessageBody>
    </Flex>
  );
};
