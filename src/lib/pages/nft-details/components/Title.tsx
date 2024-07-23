import { Alert, Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { HexAddr32 } from "lib/types";

import { ViewResourceButton } from "./ViewResourceButton";

interface TitleProps {
  collectionAddress: HexAddr32;
  nftAddress: HexAddr32;
  displayCollectionName: string;
  tokenId: string;
  isBurned: boolean;
}

export const Title = ({
  collectionAddress,
  displayCollectionName,
  tokenId,
  nftAddress,
  isBurned,
}: TitleProps) => {
  const isMobile = useMobile();
  return (
    <Flex direction="column" w="full">
      {isBurned && (
        <Alert variant="warning" px={2} py={1} borderRadius="4px" mb={4}>
          <Text variant="body2" color="warning.main">
            This NFT is already burned
          </Text>
        </Alert>
      )}
      <Flex w="full" justifyContent="space-between" gap={8}>
        <Flex direction="column" overflow="hidden">
          <AppLink href={`/nft-collections/${collectionAddress}`}>
            <Text color="secondary.main" fontSize="16px" fontWeight={700}>
              {displayCollectionName}
            </Text>
          </AppLink>
          <Heading
            variant={{ base: "h6", md: "h5" }}
            as="h5"
            className="ellipsis"
            wordBreak="break-word"
          >
            {tokenId}
          </Heading>
        </Flex>
        {!isMobile && <ViewResourceButton nftAddress={nftAddress} />}
      </Flex>
    </Flex>
  );
};
