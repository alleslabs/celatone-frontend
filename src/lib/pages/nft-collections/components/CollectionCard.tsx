import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useMetadata } from "lib/services/nft";
import type { Collection } from "lib/services/nft";

interface CollectionCardProps {
  collectionInfo: Collection;
}

export const CollectionCard = ({ collectionInfo }: CollectionCardProps) => {
  const { uri, description, name } = collectionInfo;
  const { data: metadata } = useMetadata(uri);

  return (
    <Box
      p={{ base: 3, md: 6 }}
      h="full"
      bg="gray.900"
      borderRadius="8px"
      transition="all .25s ease-in-out"
      _hover={{
        bg: "gray.800",
      }}
    >
      <Flex gap="24px" maxW="full" w="full" overflow="hidden">
        <Image
          minW={{ base: 28, md: 40 }}
          w={{ base: 28, md: 40 }}
          h={{ base: 28, md: 40 }}
          objectFit="cover"
          backgroundPosition="center"
          borderRadius="8px"
          src={metadata?.image}
          fallbackSrc={NFT_IMAGE_PLACEHOLDER}
          fallbackStrategy="beforeLoadOrError"
        />
        <Flex
          direction="column"
          gap={2}
          overflow="hidden"
          w="full"
          alignSelf="center"
        >
          <Heading
            as="h6"
            variant="h6"
            overflow="hidden"
            fontWeight={600}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {name}
          </Heading>
          <Text
            color="text.dark"
            variant={{ base: "body3", md: "body2" }}
            fontWeight={400}
            overflow="hidden"
            wordBreak="break-word"
            textOverflow="ellipsis"
            lineHeight="125%"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </Text>
          <Box borderY="1px solid var(--chakra-colors-gray-700)" mt={2} />
          <Flex flexWrap="wrap">
            <Flex direction="column" flex={1} minW="fit-content" mt={2}>
              <Text variant="body2" color="text.dark">
                Created by
              </Text>
              <ExplorerLink
                value={collectionInfo.creator}
                type="user_address"
                ampCopierSection="collection-list"
              />
            </Flex>
            <Flex direction="column" flex={1} minW="fit-content" mt={2}>
              <Text color="text.dark" variant="body2">
                Collection
              </Text>
              <ExplorerLink
                value={collectionInfo.collectionAddress}
                type="contract_address"
                ampCopierSection="collection-list"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
