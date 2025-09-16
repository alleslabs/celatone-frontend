import type { Metadata } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { AppLink } from "lib/components/AppLink";
import { NftImage } from "lib/components/nft/NftImage";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useNftGlyphImage, useNftMetadata } from "lib/services/nft";
import { zAddr, zHexAddr32 } from "lib/types";

interface BalanceChangeNftProps {
  change: number;
  id: string;
  metadata: Metadata;
}

export const BalanceChangeNft = ({
  change,
  id,
  metadata,
}: BalanceChangeNftProps) => {
  const formatAddresses = useFormatAddresses();
  const nftMetadata = metadata[id];
  const nftObject = {
    collectionAddress: zAddr.optional().parse(nftMetadata?.collectionAddress),
    nftAddress: zHexAddr32.parse(formatAddresses(id).hex),
    tokenId: nftMetadata?.tokenId,
    uri: nftMetadata?.tokenUri,
  };
  const { data: nft } = useNftMetadata(nftObject);
  const nftImage = useNftGlyphImage(nftObject);

  if (!nft) return null;

  const isPositiveAmount = change > 0;
  const formattedAmount = `${isPositiveAmount ? "+" : "-"}${" "}${nft?.name}`;

  return (
    <Flex align="center" gap={1}>
      {nftMetadata?.collectionAddress ? (
        <AppLink
          href={`/nft-collections/${nftMetadata.collectionAddress}/nft/${id}`}
        >
          <NftImage
            borderRadius="4px"
            height="20px"
            src={nftImage}
            width="20px"
          />
        </AppLink>
      ) : (
        <NftImage
          borderRadius="4px"
          height="20px"
          src={nftImage}
          width="20px"
        />
      )}
      <Text color={isPositiveAmount ? "success.main" : "error.main"}>
        {formattedAmount}
      </Text>
    </Flex>
  );
};
