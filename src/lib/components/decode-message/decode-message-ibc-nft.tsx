import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { useMetadata } from "lib/services/nft";
import { zAddr, zHexAddr32 } from "lib/types";
import { formatUTC, parseNanosecondsToDate } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { AppLink } from "../AppLink";
import { ExplorerLink } from "../ExplorerLink";
import JsonReadOnly from "../json/JsonReadOnly";
import { NftImage } from "../nft/NftImage";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageIbcNftProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "ibc_nft_receive" | "ibc_nft_send";
  };
  metadata?: Metadata;
}

export const DecodeMessageIbcNft = ({
  compact,
  decodedMessage,
  log,
  metadata,
  msgBody,
  msgCount,
}: DecodeMessageIbcNftProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;
  const getAddressType = useGetAddressType();
  const nftMetadata = metadata?.[data.tokenAddress];
  const { data: nft } = useMetadata({
    collectionAddress: zAddr.parse(nftMetadata?.collectionAddress),
    nftAddress: zHexAddr32.parse(data.tokenAddress),
    tokenId: nftMetadata?.tokenId,
    uri: nftMetadata?.tokenUri,
  });

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        iconName="collection"
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="NFT Bridge"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        {nft && (
          <Flex align="center" gap={1} minW="fit-content">
            <AppLink
              href={`/nft-collections/${data.collectionId}/nft/${data.tokenAddress}`}
            >
              <NftImage
                borderRadius="4px"
                height="20px"
                src={nft.image}
                width="20px"
              />
            </AppLink>
            <ExplorerLink
              showCopyOnHover
              textFormat="normal"
              textLabel={nft.name}
              type="nft_collection"
              value={`${data.collectionId}/nft/${data.tokenAddress}`}
            />
          </Flex>
        )}
        {decodedMessage.action === "ibc_nft_send" ? (
          <Flex align="center" gap={2}>
            <Text color="text.dark">to</Text>
            <Text whiteSpace="nowrap">{data.dstChainId}</Text>
          </Flex>
        ) : (
          <Flex align="center" gap={2}>
            <Text color="text.dark">from</Text>
            <Text whiteSpace="nowrap">{data.srcChainId}</Text>
          </Flex>
        )}
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="From network">
          <Text>{data.srcChainId}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Sender">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.sender)}
            value={data.sender}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="To network">
          <Text>{data.dstChainId}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Receiver">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.receiver)}
            value={data.receiver}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Collection">
          <ExplorerLink
            showCopyOnHover
            textFormat="truncate"
            textLabel={data.collection.name}
            type="user_address"
            value={data.collectionId}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="NFT">
          {nft ? (
            <Stack spacing={2}>
              <AppLink
                href={`/nft-collections/${data.collectionId}/nft/${data.tokenAddress}`}
              >
                <NftImage borderRadius="8px" src={nft.image} width="150px" />
              </AppLink>
              <ExplorerLink
                showCopyOnHover
                textFormat="normal"
                textLabel={nft.name}
                type="nft_collection"
                value={`${data.collectionId}/nft/${data.tokenAddress}`}
              />
            </Stack>
          ) : (
            <ExplorerLink
              showCopyOnHover
              textFormat="normal"
              type="user_address"
              value={data.tokenAddress}
            />
          )}
        </DecodeMessageRow>
        <DecodeMessageRow title="Source channel">
          <Text>{data.srcChannel}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Source port">
          <Text>{data.srcPort}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Class ID">
          <Text>{data.collectionId}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Token IDs">
          <JsonReadOnly
            canCopy
            fullWidth
            isExpandable
            text={JSON.stringify(data.tokenIds, null, 2)}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Timeout height">
          <JsonReadOnly
            canCopy
            fullWidth
            isExpandable
            text={JSON.stringify(data.timeoutHeight, null, 2)}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Timeout timestamp">
          {formatUTC(parseNanosecondsToDate(data.timeoutTimestamp))}
        </DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
