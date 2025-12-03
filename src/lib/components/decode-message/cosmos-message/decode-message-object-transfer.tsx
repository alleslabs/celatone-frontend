import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useNftGlyphImage, useNftMetadata } from "lib/services/nft";
import { zAddr, zHexAddr32 } from "lib/types";
import { useState } from "react";

import type { TxMsgData } from "../../tx-message";

import { AppLink } from "../../AppLink";
import { NftImage } from "../../nft/NftImage";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageExecute } from "../decode-message-execute";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageObjectTransferProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "object_transfer";
  };
  metadata?: Metadata & {
    type: "move";
  };
}

export const DecodeMessageObjectTransfer = ({
  compact,
  decodedMessage,
  log,
  metadata,
  msgBody,
  msgCount,
}: DecodeMessageObjectTransferProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const {
    data: { from, object, to },
    isIbc,
    isOp,
  } = decodedMessage;
  const formatAddresses = useFormatAddresses();
  const nftMetadata = metadata?.data?.[object];
  const nftObject = {
    collectionAddress: zAddr.optional().parse(nftMetadata?.collectionAddress),
    nftAddress: zHexAddr32.parse(formatAddresses(object).hex),
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
        label={nftMetadata ? "NFT Transfer" : "Object Transfer"}
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        {nft && nftMetadata && (
          <Flex align="center" gap={1} minW="fit-content">
            <AppLink
              href={`/nft-collections/${nftMetadata.collectionAddress}/nft/${object}`}
            >
              <NftImage
                borderRadius="4px"
                height="20px"
                src={nftImage}
                width="20px"
              />
            </AppLink>
            <ExplorerLink
              showCopyOnHover
              sx={{
                whiteSpace: "nowrap",
              }}
              textFormat="normal"
              textLabel={nft.name}
              type="nft_collection"
              value={`${nftMetadata.collectionAddress}/nft/${object}`}
            />
          </Flex>
        )}
        {!compact && (
          <>
            <Flex align="center" gap={2}>
              <Text color="text.dark">from</Text>
              <ExplorerLink
                showCopyOnHover
                textVariant={compact ? "body2" : "body1"}
                type={getAddressType(from)}
                value={from}
              />
            </Flex>
            <Flex align="center" gap={2}>
              <Text color="text.dark">to</Text>
              <ExplorerLink
                showCopyOnHover
                textVariant={compact ? "body2" : "body1"}
                type={getAddressType(to)}
                value={to}
              />
            </Flex>
          </>
        )}
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Sender">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(from)}
            value={from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Receiver">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(to)}
            value={to}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        {nftMetadata && (
          <DecodeMessageRow title="Collection">
            <ExplorerLink
              showCopyOnHover
              textFormat="normal"
              type="nft_collection"
              value={`${nftMetadata.collectionAddress}`}
            />
          </DecodeMessageRow>
        )}
        <DecodeMessageRow title="NFT">
          {nft && nftMetadata ? (
            <Stack spacing={2}>
              <AppLink
                href={`/nft-collections/${nftMetadata.collectionAddress}/nft/${object}`}
              >
                <NftImage borderRadius="8px" height="150px" src={nftImage} />
              </AppLink>
              <ExplorerLink
                showCopyOnHover
                textFormat="normal"
                textLabel={nft.name}
                type="nft_collection"
                value={`${nftMetadata.collectionAddress}/nft/${object}`}
              />
            </Stack>
          ) : (
            <ExplorerLink
              showCopyOnHover
              textFormat="normal"
              type="user_address"
              value={object}
            />
          )}
        </DecodeMessageRow>
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
