import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import {
  useNftByTokenId,
  useNftGlyphImage,
  useNftMetadata,
} from "lib/services/nft";
import { zBechAddr32, zHexAddr } from "lib/types";
import { formatUTC, parseNanosecondsToDate } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../../tx-message";

import { AppLink } from "../../AppLink";
import { ChainBadge } from "../../ChainBadge";
import { ExplorerLink } from "../../ExplorerLink";
import { CustomIcon } from "../../icon";
import JsonReadOnly from "../../json/JsonReadOnly";
import { NftImage } from "../../nft/NftImage";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageIbcNftEvmProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "ibc_nft_receive_evm" | "ibc_nft_send_evm";
  };
}

export const DecodeMessageIbcNftEvm = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageIbcNftEvmProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;
  const getAddressType = useGetAddressType();

  // Get first token ID to display NFT preview
  const firstTokenId = data.tokenIds[0];
  const collectionAddressHex = zHexAddr.parse(data.contractAddress);
  const collectionAddressBech = zBechAddr32.parse(data.contractAddress);
  const { data: nft } = useNftByTokenId(
    collectionAddressHex,
    collectionAddressBech,
    firstTokenId
  );
  const { data: nftMetadata } = useNftMetadata(nft);
  const nftImage = useNftGlyphImage(nft);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
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
              href={`/nft-collections/${data.contractAddress}/nft/${firstTokenId}`}
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
              textFormat="normal"
              textLabel={nftMetadata?.name || `#${firstTokenId}`}
              type="nft_collection"
              value={`${data.contractAddress}/nft/${firstTokenId}`}
            />
          </Flex>
        )}
        {data.tokenIds.length > 1 && (
          <Text color="text.main" fontWeight={600}>
            +{data.tokenIds.length - 1} more
          </Text>
        )}
        {decodedMessage.action === "ibc_nft_send_evm" ? (
          <Flex align="center" gap={2}>
            <Text color="text.dark">to</Text>
            <ChainBadge chainId={data.dstChainId} />
          </Flex>
        ) : (
          <Flex align="center" gap={2}>
            <Text color="text.dark">from</Text>
            <ChainBadge chainId={data.srcChainId} />
          </Flex>
        )}
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Source chain">
          <ChainBadge chainId={data.srcChainId} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Sender">
          <ExplorerLink
            chainId={data.srcChainId}
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.sender)}
            value={data.sender}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Destination chain">
          <ChainBadge chainId={data.dstChainId} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Receiver">
          <ExplorerLink
            chainId={data.dstChainId}
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type={getAddressType(data.receiver)}
            value={data.receiver}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="ERC-721 Contract">
          <ExplorerLink
            leftIcon={
              <CustomIcon
                boxSize={4}
                color="primary.main"
                name="contract-address"
              />
            }
            showCopyOnHover
            textFormat="normal"
            type="evm_contract_address"
            value={data.contractAddress}
          />
        </DecodeMessageRow>
        {nft && (
          <DecodeMessageRow title="Collection">
            <ExplorerLink
              showCopyOnHover
              textLabel={nft.collectionName}
              type="nft_collection"
              value={nft.collectionAddress}
            />
          </DecodeMessageRow>
        )}
        <DecodeMessageRow title="NFT">
          {nft ? (
            <Stack spacing={2}>
              <AppLink
                href={`/nft-collections/${data.contractAddress}/nft/${firstTokenId}`}
              >
                <NftImage borderRadius="8px" src={nftImage} width="150px" />
              </AppLink>
              <ExplorerLink
                showCopyOnHover
                textFormat="normal"
                textLabel={nftMetadata?.name || `#${firstTokenId}`}
                type="nft_collection"
                value={`${data.contractAddress}/nft/${firstTokenId}`}
              />
            </Stack>
          ) : (
            <Text>Token ID: {firstTokenId}</Text>
          )}
        </DecodeMessageRow>
        <DecodeMessageRow title="Source channel">
          <Text>{data.srcChannel}</Text>
        </DecodeMessageRow>
        <DecodeMessageRow title="Source port">
          <Text>{data.srcPort}</Text>
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
