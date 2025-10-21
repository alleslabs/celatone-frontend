import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useNftGlyphImage, useNftMetadata } from "lib/services/nft";
import { zAddr, zHexAddr32 } from "lib/types";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { AppLink } from "../AppLink";
import { ExplorerLink } from "../ExplorerLink";
import { NftImage } from "../nft/NftImage";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageExecute } from "./decode-message-execute";
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
    data: { collection, collectionAddress, from, tokenAddress },
    isIbc,
    isOp,
  } = decodedMessage;
  const getAddressType = useGetAddressType();
  const formatAddresses = useFormatAddresses();
  const nftMetadata = metadata?.[tokenAddress];
  const nftObject = {
    collectionAddress: zAddr.optional().parse(collectionAddress),
    nftAddress: zHexAddr32.parse(formatAddresses(tokenAddress).hex),
    tokenId: nftMetadata?.tokenId,
    uri: nftMetadata?.tokenUri,
  };
  const { data: nft } = useNftMetadata(nftObject);
  const nftImage = useNftGlyphImage(nftObject);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="NFT Mint"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        {nft && (
          <Flex align="center" gap={1} minW="fit-content">
            <AppLink
              href={`/nft-collections/${collectionAddress}/nft/${tokenAddress}`}
            >
              <NftImage
                borderRadius="4px"
                height="20px"
                src={nftImage}
                width="20px"
              />
            </AppLink>
            <ExplorerLink
              copyValue={tokenAddress}
              showCopyOnHover
              textFormat="normal"
              textLabel={nft.name}
              type="nft_collection"
              value={`${collectionAddress}/nft/${tokenAddress}`}
            />
          </Flex>
        )}
        {!compact && (
          <Flex align="center" gap={2}>
            <Text color="text.dark">by</Text>
            <ExplorerLink
              showCopyOnHover
              textVariant={compact ? "body2" : "body1"}
              type={getAddressType(from)}
              value={from}
            />
          </Flex>
        )}
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
            textLabel={collection.name}
            type="nft_collection"
            value={collectionAddress}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="NFT">
          {nft ? (
            <Stack spacing={2}>
              <AppLink
                href={`/nft-collections/${collectionAddress}/nft/${tokenAddress}`}
              >
                <NftImage borderRadius="8px" src={nftImage} width="150px" />
              </AppLink>
              <ExplorerLink
                showCopyOnHover
                textFormat="normal"
                textLabel={nft.name}
                type="nft_collection"
                value={`${collectionAddress}/nft/${tokenAddress}`}
              />
            </Stack>
          ) : (
            <ExplorerLink
              showCopyOnHover
              textFormat="normal"
              type="user_address"
              value={tokenAddress}
            />
          )}
        </DecodeMessageRow>
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
