import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ExplorerLink } from "../ExplorerLink";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageNftBurnProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "nft_burn";
  };
}

export const DecodeMessageNftBurn = ({
  compact,
  decodedMessage,
  isSingleMsg,
  log,
  msgBody,
}: DecodeMessageNftBurnProps) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

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
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex align="center" gap={1}>
          <ExplorerLink
            showCopyOnHover
            textFormat="truncate"
            type="user_address"
            value={data.tokenAddress}
          />
          by
          <ExplorerLink showCopyOnHover type="user_address" value={data.from} />
        </Flex>
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Burner">
          <ExplorerLink showCopyOnHover type="user_address" value={data.from} />
        </DecodeMessageRow>
        <DecodeMessageRow title="NFT">
          <ExplorerLink
            showCopyOnHover
            textFormat="truncate"
            type="user_address"
            value={data.tokenAddress}
          />
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
