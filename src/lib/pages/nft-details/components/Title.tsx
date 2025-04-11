import type { HexAddr32 } from "lib/types";

import { Alert, Flex, Heading, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";

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
        <Alert borderRadius="4px" mb={4} px={2} py={1} variant="warning">
          <Text color="warning.main" variant="body2">
            This NFT is already burned
          </Text>
        </Alert>
      )}
      <Flex gap={8} justifyContent="space-between" w="full">
        <Flex direction="column" overflow="hidden">
          <AppLink href={`/nft-collections/${collectionAddress}`}>
            <Text color="primary.main" fontSize="16px" fontWeight={700}>
              {displayCollectionName}
            </Text>
          </AppLink>
          <Heading
            className="ellipsis"
            as="h5"
            variant={{ base: "h6", md: "h5" }}
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
