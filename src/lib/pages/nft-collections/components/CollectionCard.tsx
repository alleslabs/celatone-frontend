import type { Collection } from "lib/services/types";
import type { HexAddr32 } from "lib/types";

import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useGetFirstNftAsCollectionImage } from "lib/hooks";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { extractNftDescription } from "lib/utils/nftDescription";
import { useMemo } from "react";

interface CollectionCardProps {
  collectionInfo: Collection;
}

export const CollectionCard = ({ collectionInfo }: CollectionCardProps) => {
  const isMobile = useMobile();
  const { description, name } = collectionInfo;
  const { enabled: isEvmEnabled } = useEvmConfig({ shouldRedirect: false });
  const formatAddresses = useFormatAddresses();

  const formattedCollection = formatAddresses(collectionInfo.collectionAddress);

  const { collectionAddress, creator } = useMemo(() => {
    const formattedCreator = collectionInfo.creator
      ? formatAddresses(collectionInfo.creator)
      : { address: undefined, hex: undefined };

    const addressKey = isEvmEnabled ? "hex" : "address";

    return {
      collectionAddress: formattedCollection[addressKey],
      creator: formattedCreator[addressKey],
    };
  }, [
    collectionInfo.creator,
    formatAddresses,
    isEvmEnabled,
    formattedCollection,
  ]);

  const collectionImage = useGetFirstNftAsCollectionImage(
    formattedCollection.hex as HexAddr32
  );

  return (
    <AppLink href={`/nft-collections/${collectionAddress}`}>
      <Box
        _hover={{
          bg: "gray.800",
        }}
        bg="gray.900"
        borderRadius="8px"
        h="full"
        p={{ base: 3, md: 6 }}
        transition="all .25s ease-in-out"
      >
        <Flex gap={{ base: 4, md: 6 }} maxW="full" overflow="hidden" w="full">
          <Image
            background="gray.900"
            backgroundPosition="center"
            borderRadius="8px"
            fallbackSrc={NFT_IMAGE_PLACEHOLDER}
            fallbackStrategy="beforeLoadOrError"
            h={{ base: 28, md: 40 }}
            minW={{ base: 28, md: 40 }}
            objectFit="contain"
            src={collectionImage}
            w={{ base: 28, md: 40 }}
          />
          <Flex
            alignSelf="flex-start"
            direction="column"
            gap={2}
            overflow="hidden"
            w="full"
          >
            <Flex
              borderBottomColor="gray.700"
              borderBottomWidth="1px"
              direction="column"
              gap={1}
              pb={{ base: 3, md: 4 }}
            >
              <Heading
                as="h6"
                color={name.length ? "text.primary" : "text.disabled"}
                fontWeight={name.length ? 600 : 300}
                overflow="hidden"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
                variant="h6"
              >
                {name.length ? name : "Untitled collection"}
              </Heading>
              {description && (
                <Text
                  color="text.dark"
                  fontWeight={400}
                  lineHeight="125%"
                  overflow="hidden"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                  }}
                  textOverflow="ellipsis"
                  variant={{ base: "body3", md: "body2" }}
                  wordBreak="break-word"
                >
                  {extractNftDescription(description)}
                </Text>
              )}
            </Flex>
            <Flex flexWrap="wrap" mt={{ md: 2 }}>
              {creator && (
                <Flex direction="column" flex={1} minW="fit-content">
                  <Text color="text.dark" variant="body2">
                    Created by
                  </Text>
                  <ExplorerLink
                    ampCopierSection="collection-list"
                    minW={36}
                    showCopyOnHover={!isMobile}
                    type="user_address"
                    value={creator}
                  />
                </Flex>
              )}
              <Flex direction="column" flex={1} minW="fit-content">
                <Text color="text.dark" variant="body2">
                  Collection address
                </Text>
                <ExplorerLink
                  ampCopierSection="collection-list"
                  minW={36}
                  showCopyOnHover={!isMobile}
                  type="contract_address"
                  value={collectionAddress}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </AppLink>
  );
};
