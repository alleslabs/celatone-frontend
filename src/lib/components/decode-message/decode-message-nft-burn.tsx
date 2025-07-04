import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";

interface DecodeMessageNftBurnProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "nft_burn";
  };
}

export const DecodeMessageNftBurn = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageNftBurnProps) => {
  const isSingleMsg = msgCount === 1;
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
        label="NFT Burn"
        msgCount={msgCount}
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
