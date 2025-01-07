import { Alert, Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { HexAddr32 } from "lib/types";

import { ViewResourceButton } from "./ViewResourceButton";

interface TitleProps {
  collectionAddress: HexAddr32;
  displayCollectionName: string;
  isBurned: boolean;
  nftAddress: HexAddr32;
  tokenId: string;
}

export const Title = ({
  collectionAddress,
  displayCollectionName,
  isBurned,
  nftAddress,
  tokenId,
}: TitleProps) => {
  const isMobile = useMobile();
  return (
    <Flex w="full" direction="column">
      {isBurned && (
        <Alert mb={4} px={2} py={1} variant="warning" borderRadius="4px">
          <Text variant="body2" color="warning.main">
            This NFT is already burned
          </Text>
        </Alert>
      )}
      <Flex gap={8} w="full" justifyContent="space-between">
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
