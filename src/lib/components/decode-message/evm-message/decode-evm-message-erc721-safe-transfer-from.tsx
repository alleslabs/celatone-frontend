import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedErc721SafeTransferFromCall } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { Flex, Stack, Text } from "@chakra-ui/react";
import {
  useNftByTokenId,
  useNftGlyphImage,
  useNftMetadata,
} from "lib/services/nft";
import { zBechAddr32, zHexAddr } from "lib/types";

import { AppLink } from "../../AppLink";
import { ExplorerLink } from "../../ExplorerLink";
import { NftImage } from "../../nft/NftImage";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageErc721SafeTransferFromProps {
  compact: boolean;
  decodedTransaction: DecodedErc721SafeTransferFromCall;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageErc721SafeTransferFromHeader = ({
  compact,
  decodedTransaction,
  msgCount,
}: DecodeEvmMessageErc721SafeTransferFromProps) => {
  const { contract, from, to, tokenId } = decodedTransaction.data;

  // Fetch NFT data using the contract address and token ID
  const collectionAddressHex = zHexAddr.parse(contract);
  const collectionAddressBech = zBechAddr32.parse(contract);
  const { data: nft } = useNftByTokenId(
    collectionAddressHex,
    collectionAddressBech,
    tokenId
  );

  // Fetch NFT metadata for name and image
  const { data: nftMetadata } = useNftMetadata(nft);
  const nftImageUrl = useNftGlyphImage(nft);

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand
        isIbc={false}
        isOpinit={false}
        isSingleMsg={msgCount === 1}
        label="NFT transfer"
        msgCount={msgCount}
        type={decodedTransaction.action}
      >
        {nft && (
          <Flex align="center" gap={1} minW="fit-content">
            <AppLink href={`/nft-collections/${contract}/nft/${tokenId}`}>
              <NftImage
                borderRadius="4px"
                height="20px"
                src={nftImageUrl}
                width="20px"
              />
            </AppLink>
            <ExplorerLink
              showCopyOnHover
              textLabel={nftMetadata?.name || nft.tokenId}
              type="nft_collection"
              value={`${contract}/nft/${tokenId}`}
            />
          </Flex>
        )}
        <Text color="text.dark">from</Text>
        <ExplorerLink showCopyOnHover type="evm_tx_hash" value={from} />
        <Text color="text.dark">to</Text>
        <ExplorerLink showCopyOnHover type="evm_tx_hash" value={to} />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageErc721SafeTransferFromBody = ({
  compact,
  decodedTransaction,
}: DecodeEvmMessageErc721SafeTransferFromProps) => {
  const { contract, from, to, tokenId } = decodedTransaction.data;

  // Fetch NFT data using the contract address and token ID
  const collectionAddressHex = zHexAddr.parse(contract);
  const collectionAddressBech = zBechAddr32.parse(contract);
  const { data: nft } = useNftByTokenId(
    collectionAddressHex,
    collectionAddressBech,
    tokenId
  );

  // Fetch NFT metadata for name and image
  const { data: nftMetadata } = useNftMetadata(nft);
  const nftImageUrl = useNftGlyphImage(nft);

  return (
    <DecodeMessageBody
      compact={compact}
      isExpand
      log={undefined}
      sx={{
        pb: 1,
        pl: 0,
      }}
    >
      <DecodeMessageRow title="Sender">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="evm_tx_hash"
          value={from}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Receiver">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="evm_tx_hash"
          value={to}
        />
      </DecodeMessageRow>
      {/* // TODO: Missing collection name */}
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
            <AppLink href={`/nft-collections/${contract}/nft/${tokenId}`}>
              <NftImage borderRadius="8px" src={nftImageUrl} width="150px" />
            </AppLink>
            <ExplorerLink
              showCopyOnHover
              textFormat="normal"
              textLabel={nftMetadata?.name || `#${tokenId}`}
              type="nft_collection"
              value={`${contract}/nft/${tokenId}`}
            />
          </Stack>
        ) : (
          <Text>Token ID: {tokenId}</Text>
        )}
      </DecodeMessageRow>
    </DecodeMessageBody>
  );
};
