import type { DecodedMessage, Metadata } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { ExplorerLink } from "../ExplorerLink";
import JsonReadOnly from "../json/JsonReadOnly";
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
  msgBody,
  msgCount,
}: DecodeMessageIbcNftProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;
  const getAddressType = useGetAddressType();

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
        {decodedMessage.action === "ibc_nft_send" ? (
          <Flex align="center" gap={2}>
            <Text color="text.dark">from</Text>
            <Text whiteSpace="nowrap">{data.srcChainId}</Text>
          </Flex>
        ) : (
          <Flex align="center" gap={2}>
            <Text color="text.dark">to</Text>
            <Text whiteSpace="nowrap">{data.dstChainId}</Text>
          </Flex>
        )}
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="From network">
          <Text>
            {decodedMessage.action === "ibc_nft_send"
              ? data.srcChainId
              : data.dstChainId}
          </Text>
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
          <Text>
            {decodedMessage.action === "ibc_nft_send"
              ? data.dstChainId
              : data.srcChainId}
          </Text>
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
        <DecodeMessageRow title="NFT">-</DecodeMessageRow>
        <DecodeMessageRow title="Source channel">
          <Text>
            {decodedMessage.action === "ibc_nft_send"
              ? data.srcChannel
              : data.dstChannel}
          </Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Source port">
          <Text>
            {decodedMessage.action === "ibc_nft_send"
              ? data.srcPort
              : data.dstPort}
          </Text>
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
        {/* // TODO: Timeout height */}
        <DecodeMessageRow title="Timeout height">-</DecodeMessageRow>
        {/* // TODO: Timeout timestamp */}
        <DecodeMessageRow title="Timeout timestamp">-</DecodeMessageRow>
      </DecodeMessageBody>
    </Flex>
  );
};
