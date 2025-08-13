import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ExplorerLink } from "../ExplorerLink";
import { NftImage } from "../nft/NftImage";
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
  log,
  msgBody,
  msgCount,
}: DecodeMessageNftBurnProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="NFT Burn"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex align="center" gap={2}>
          <Flex align="center" gap={1} minW="fit-content">
            <NftImage borderRadius="4px" height="20px" width="20px" />
            <ExplorerLink
              showCopyOnHover
              textFormat="truncate"
              type="user_address"
              value={data.tokenAddress}
            />
          </Flex>
          by
          <ExplorerLink showCopyOnHover type="user_address" value={data.from} />
        </Flex>
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Burner">
          <ExplorerLink showCopyOnHover type="user_address" value={data.from} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Collection">
          <ExplorerLink
            showCopyOnHover
            textFormat="normal"
            textLabel={data.collection.name}
            type="nft_collection"
            value={`${data.collectionAddress}`}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="NFT">
          <NftImage borderRadius="8px" width="150px" />
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
