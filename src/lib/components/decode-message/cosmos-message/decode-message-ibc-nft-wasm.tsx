import type { DecodedMessage } from "@initia/tx-decoder";
import type { TxMsgData } from "lib/components/tx-message";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ChainBadge } from "lib/components/ChainBadge";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { NftImage } from "lib/components/nft/NftImage";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import {
  useNftByTokenId,
  useNftGlyphImage,
  useNftMetadata,
} from "lib/services/nft";
import { zBechAddr32, zHexAddr } from "lib/types";
import { formatUTC, parseNanosecondsToDate } from "lib/utils";
import { memo, useMemo, useState } from "react";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageIbcNftWasmProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "ibc_nft_receive_wasm" | "ibc_nft_send_wasm";
  };
}

export const DecodeMessageIbcNftWasm = memo(
  ({
    compact,
    decodedMessage,
    log,
    msgBody,
    msgCount,
  }: DecodeMessageIbcNftWasmProps) => {
    const isSingleMsg = msgCount === 1;
    const [expand, setExpand] = useState(!!isSingleMsg);
    const getAddressType = useGetAddressType();
    const formatAddresses = useFormatAddresses();
    const { action, data, isIbc, isOp } = decodedMessage;

    const collectionAddressHex = useMemo(
      () =>
        data.contractAddress
          ? zHexAddr.parse(formatAddresses(data.contractAddress).hex)
          : undefined,
      [data.contractAddress, formatAddresses]
    );
    const collectionAddressBech = useMemo(
      () =>
        data.contractAddress
          ? zBechAddr32.parse(formatAddresses(data.contractAddress).address)
          : undefined,
      [data.contractAddress, formatAddresses]
    );

    const isNftQueryEnabled = Boolean(
      collectionAddressHex && collectionAddressBech && data.tokenIds?.[0]
    );

    const { data: nft } = useNftByTokenId(
      collectionAddressHex!,
      collectionAddressBech!,
      data.tokenIds?.[0],
      isNftQueryEnabled
    );
    const { data: nftMetadata } = useNftMetadata(nft);
    const nftImageUrl = useNftGlyphImage(nft);

    const isSend = action === "ibc_nft_send_wasm";
    const label = isSend ? "IBC NFT send" : "IBC NFT receive";

    return (
      <Flex direction="column" maxW="inherit">
        <DecodeMessageHeader
          compact={compact}
          gap={2}
          isExpand={expand}
          isIbc={isIbc}
          isOpinit={isOp}
          isSingleMsg={!!isSingleMsg}
          label={label}
          msgCount={msgCount}
          type={msgBody["@type"]}
          onClick={() => setExpand(!expand)}
        >
          {nft && data.tokenIds?.[0] && (
            <Flex align="center" gap={1} minW="fit-content">
              <AppLink
                href={`/nft-collections/${data.contractAddress}/nft/${data.tokenIds[0]}`}
              >
                <NftImage
                  borderRadius="4px"
                  height="20px"
                  src={nftImageUrl}
                  width="20px"
                />
              </AppLink>
              <ExplorerLink
                showCopyOnHover
                textFormat="normal"
                textLabel={nftMetadata?.name || `#${data.tokenIds[0]}`}
                type="nft_collection"
                value={`${data.contractAddress}/nft/${data.tokenIds[0]}`}
              />
            </Flex>
          )}
          {!compact && (
            <Flex align="center" gap={2}>
              <Text color="text.dark">{isSend ? "to" : "from"}</Text>
              <ChainBadge
                chainId={isSend ? data.dstChainId : data.srcChainId}
              />
            </Flex>
          )}
        </DecodeMessageHeader>
        <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
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
          {isSend && (
            <>
              <DecodeMessageRow title="Source channel">
                <Text>{data.srcChannel}</Text>
              </DecodeMessageRow>
              <DecodeMessageRow title="Destination chain">
                <ChainBadge chainId={data.dstChainId} />
              </DecodeMessageRow>
            </>
          )}
          {!isSend && (
            <>
              <DecodeMessageRow title="Source chain">
                <ChainBadge chainId={data.srcChainId} />
              </DecodeMessageRow>
              <DecodeMessageRow title="Destination channel">
                <Text>{data.dstChannel}</Text>
              </DecodeMessageRow>
            </>
          )}
          {data.contractAddress && (
            <DecodeMessageRow title="Collection">
              <ExplorerLink
                leftIcon={
                  <CustomIcon
                    boxSize={4}
                    color="primary.main"
                    name="contract-address"
                  />
                }
                maxWidth="full"
                showCopyOnHover
                textFormat="normal"
                textLabel={nft?.collectionName}
                type="nft_collection"
                value={data.contractAddress}
                wordBreak="break-word"
              />
            </DecodeMessageRow>
          )}
          {data.tokenIds && data.tokenIds.length > 0 && (
            <DecodeMessageRow title="NFT">
              <Stack spacing={2}>
                <AppLink
                  href={`/nft-collections/${data.contractAddress}/nft/${data.tokenIds[0]}`}
                >
                  <NftImage
                    borderRadius="8px"
                    src={nftImageUrl}
                    width="150px"
                  />
                </AppLink>
                <ExplorerLink
                  showCopyOnHover
                  textFormat="normal"
                  textLabel={nftMetadata?.name || `#${data.tokenIds[0]}`}
                  type="nft_collection"
                  value={`${data.contractAddress}/nft/${data.tokenIds[0]}`}
                />
              </Stack>
            </DecodeMessageRow>
          )}
          {data.timeoutHeight && (
            <DecodeMessageRow title="Timeout height">
              <JsonReadOnly
                canCopy
                fullWidth
                isExpandable
                text={JSON.stringify(data.timeoutHeight, null, 2)}
              />
            </DecodeMessageRow>
          )}
          {data.timeoutTimestamp && (
            <DecodeMessageRow title="Timeout timestamp">
              {formatUTC(parseNanosecondsToDate(data.timeoutTimestamp))}
            </DecodeMessageRow>
          )}
        </DecodeMessageBody>
      </Flex>
    );
  }
);
