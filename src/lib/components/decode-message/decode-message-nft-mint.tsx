import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { Flex } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { useMetadata } from "lib/services/nft";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ExplorerLink } from "../ExplorerLink";
import { NftImage } from "../nft/NftImage";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageNftMintProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "nft_mint";
  };
  metadata?: Metadata;
}

export const DecodeMessageNftMint = ({
  compact,
  decodedMessage,
  log,
  metadata,
  msgBody,
  msgCount,
}: DecodeMessageNftMintProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const {
    data: { collectionAddress, from, tokenAddress },
    isIbc,
    isOp,
  } = decodedMessage;
  const getAddressType = useGetAddressType();

  const tokenUri = metadata?.[tokenAddress]?.tokenUri;

  const { data } = useMetadata(tokenUri);

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
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex align="center" gap={1}>
          <NftImage borderRadius="4px" imageUrl={data?.image} width="20px" />
          <ExplorerLink
            showCopyOnHover
            textFormat="normal"
            textLabel={data?.name}
            type="nft_collection"
            value={`${collectionAddress}/nft/${tokenAddress}`}
          />
          by <ExplorerLink showCopyOnHover type="user_address" value={from} />
        </Flex>
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Minter">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(from)}
            value={from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Collection">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type="nft_collection"
            value={collectionAddress}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Collection">
          <Flex flexDirection="column" gap={2}>
            <NftImage borderRadius="8px" imageUrl={data?.image} width="150px" />
            <ExplorerLink
              showCopyOnHover
              textFormat="normal"
              textLabel={data?.name}
              type="nft_collection"
              value={`${collectionAddress}/nft/${tokenAddress}`}
            />
          </Flex>
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
