import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedErc721TransferFromCall } from "@initia/tx-decoder";
import type { EvmVerifyInfosResponse } from "lib/services/types";
import type { Nullable, Option } from "lib/types";

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

interface DecodeEvmMessageErc721TransferFromProps {
  compact: boolean;
  decodedTransaction: DecodedErc721TransferFromCall;
  evmVerifyInfos: Option<Nullable<EvmVerifyInfosResponse>>;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageErc721TransferFromHeader = ({
  compact,
  decodedTransaction,
  evmVerifyInfos,
  msgCount,
}: DecodeEvmMessageErc721TransferFromProps) => {
  const { contract, from, owner, to, tokenId } = decodedTransaction.data;

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
        label="ERC721 transfer from"
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
        <Text color="text.dark">by</Text>
        <ExplorerLink
          showCopyOnHover
          textLabel={evmVerifyInfos?.[owner.toLowerCase()]?.contractName}
          type="user_address"
          value={owner}
        />
        <Text color="text.dark">from</Text>
        <ExplorerLink
          showCopyOnHover
          textLabel={evmVerifyInfos?.[from.toLowerCase()]?.contractName}
          type="user_address"
          value={from}
        />
        <Text color="text.dark">to</Text>
        <ExplorerLink
          showCopyOnHover
          textLabel={evmVerifyInfos?.[to.toLowerCase()]?.contractName}
          type="user_address"
          value={to}
        />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageErc721TransferFromBody = ({
  compact,
  decodedTransaction,
  evmVerifyInfos,
}: DecodeEvmMessageErc721TransferFromProps) => {
  const { contract, from, owner, to, tokenId } = decodedTransaction.data;

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
        pl: 0,
      }}
    >
      <DecodeMessageRow title="Owner">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={owner}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Sender">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={from}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Receiver">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={to}
        />
      </DecodeMessageRow>
      {nft && (
        <DecodeMessageRow title="Collection">
          <ExplorerLink
            showCopyOnHover
            textLabel={
              evmVerifyInfos?.[contract.toLowerCase()]?.contractName ??
              nft.collectionName
            }
            type="user_address"
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
