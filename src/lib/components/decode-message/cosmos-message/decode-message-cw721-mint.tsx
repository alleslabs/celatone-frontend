import type { DecodedMessage } from "@initia/tx-decoder";
import type { TxMsgData } from "lib/components/tx-message";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CopyLink } from "lib/components/CopyLink";
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
import { memo, useMemo, useState } from "react";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageCw721MintProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "cw721_mint";
  };
}

export const DecodeMessageCw721Mint = memo(
  ({
    compact,
    decodedMessage,
    log,
    msgBody,
    msgCount,
  }: DecodeMessageCw721MintProps) => {
    const isSingleMsg = msgCount === 1;
    const [expand, setExpand] = useState(!!isSingleMsg);
    const getAddressType = useGetAddressType();
    const formatAddresses = useFormatAddresses();
    const { data, isIbc, isOp } = decodedMessage;

    const collectionAddressHex = useMemo(
      () => zHexAddr.parse(formatAddresses(data.contract).hex),
      [data.contract, formatAddresses]
    );
    const collectionAddressBech = useMemo(
      () => zBechAddr32.parse(formatAddresses(data.contract).address),
      [data.contract, formatAddresses]
    );

    const { data: nft } = useNftByTokenId(
      collectionAddressHex,
      collectionAddressBech,
      data.tokenId
    );
    const { data: nftMetadata } = useNftMetadata(nft);
    const nftImageUrl = useNftGlyphImage(nft);

    return (
      <Flex direction="column" maxW="inherit">
        <DecodeMessageHeader
          compact={compact}
          gap={2}
          isExpand={expand}
          isIbc={isIbc}
          isOpinit={isOp}
          isSingleMsg={!!isSingleMsg}
          label="CW721 mint"
          msgCount={msgCount}
          type={msgBody["@type"]}
          onClick={() => setExpand(!expand)}
        >
          {nft && (
            <Flex align="center" gap={1} minW="fit-content">
              <AppLink
                href={`/nft-collections/${data.contract}/nft/${data.tokenId}`}
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
                textLabel={nftMetadata?.name || `#${data.tokenId}`}
                type="nft_collection"
                value={`${data.contract}/nft/${data.tokenId}`}
              />
            </Flex>
          )}
          {!compact && (
            <Flex align="center" gap={2}>
              <Text color="text.dark">to</Text>
              <ExplorerLink
                showCopyOnHover
                textVariant={compact ? "body2" : "body1"}
                type={getAddressType(data.owner)}
                value={data.owner}
              />
            </Flex>
          )}
        </DecodeMessageHeader>
        <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
          <DecodeMessageRow title="Owner">
            <ExplorerLink
              maxWidth="full"
              showCopyOnHover
              textFormat="normal"
              type={getAddressType(data.owner)}
              value={data.owner}
              wordBreak="break-word"
            />
          </DecodeMessageRow>
          {nft && (
            <DecodeMessageRow title="Collection">
              <ExplorerLink
                maxWidth="full"
                showCopyOnHover
                textFormat="normal"
                textLabel={nft.collectionName}
                type="nft_collection"
                value={data.contract}
                wordBreak="break-word"
              />
            </DecodeMessageRow>
          )}
          <DecodeMessageRow title="NFT">
            {nft ? (
              <Stack spacing={2}>
                <AppLink
                  href={`/nft-collections/${data.contract}/nft/${data.tokenId}`}
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
                  textLabel={nftMetadata?.name || `#${data.tokenId}`}
                  type="nft_collection"
                  value={`${data.contract}/nft/${data.tokenId}`}
                />
              </Stack>
            ) : (
              <Text>Token ID: {data.tokenId}</Text>
            )}
          </DecodeMessageRow>
          {data.tokenUri && (
            <DecodeMessageRow title="Token URI">
              <CopyLink type="token_uri" value={data.tokenUri} />
            </DecodeMessageRow>
          )}
          {data.extension !== undefined && (
            <DecodeMessageRow title="Extension">
              <JsonReadOnly
                canCopy
                fullWidth
                isExpandable
                text={JSON.stringify(data.extension, null, 2)}
              />
            </DecodeMessageRow>
          )}
          <DecodeMessageRow title="CW721 Contract">
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
              type="contract_address"
              value={data.contract}
              wordBreak="break-word"
            />
          </DecodeMessageRow>
        </DecodeMessageBody>
      </Flex>
    );
  }
);
