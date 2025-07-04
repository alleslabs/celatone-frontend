import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { useMetadata } from "lib/services/nft";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { NftImage } from "../nft/NftImage";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageObjectTransferProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "object_transfer";
  };
  metadata: Metadata;
}

export const DecodeMessageObjectTransfer = ({
  compact,
  decodedMessage,
  isSingleMsg,
  log,
  metadata,
  msgBody,
}: DecodeMessageObjectTransferProps) => {
  const [expand, setExpand] = useState(!!isSingleMsg);
  const getAddressType = useGetAddressType();
  const {
    data: { from, object, to },
    isIbc,
    isOp,
  } = decodedMessage;

  const nftMetadata = metadata[object];

  const { data } = useMetadata(nftMetadata?.tokenUri);

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
        label={nftMetadata ? "NFT Transfer" : "Object Transfer"}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <Flex gap={2}>
          {nftMetadata && (
            <>
              <NftImage
                borderRadius="4px"
                imageUrl={data?.image}
                width="20px"
              />
              <ExplorerLink
                showCopyOnHover
                textFormat="normal"
                textLabel={data?.name}
                type="nft_collection"
                value={`${nftMetadata.collectionAddress}/nft/${object}`}
              />
            </>
          )}
          <Text color="text.dark">from</Text>
          <ExplorerLink
            showCopyOnHover
            textVariant="body1"
            type={getAddressType(from)}
            value={from}
          />
        </Flex>
        <Flex gap={2}>
          <Text color="text.dark">to</Text>
          <ExplorerLink
            showCopyOnHover
            textVariant="body1"
            type={getAddressType(to)}
            value={to}
          />
        </Flex>
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
        {nftMetadata ? (
          <DecodeMessageRow title="NFT">
            <Flex flexDirection="column" gap={2}>
              <NftImage
                borderRadius="8px"
                imageUrl={data?.image}
                width="150px"
              />
              <ExplorerLink
                showCopyOnHover
                textFormat="normal"
                textLabel={data?.name}
                type="nft_collection"
                value={`${nftMetadata.collectionAddress}/nft/${object}`}
              />
            </Flex>
          </DecodeMessageRow>
        ) : (
          <DecodeMessageRow title="Object">{object}</DecodeMessageRow>
        )}
      </DecodeMessageBody>
    </Flex>
  );
};
