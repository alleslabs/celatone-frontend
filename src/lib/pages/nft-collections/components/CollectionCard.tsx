import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useMetadata } from "lib/services/nft";
import type { Collection } from "lib/services/types";

interface CollectionCardProps {
  collectionInfo: Collection;
}

export const CollectionCard = ({ collectionInfo }: CollectionCardProps) => {
  const isMobile = useMobile();
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
      <Flex gap={{ base: 4, md: 6 }} maxW="full" w="full" overflow="hidden">
        <Image
          minW={{ base: 28, md: 40 }}
          w={{ base: 28, md: 40 }}
          h={{ base: 28, md: 40 }}
          objectFit="contain"
          background="gray.900"
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
          <Flex
            direction="column"
            gap={1}
            borderBottom="1px solid"
            borderBottomColor="gray.700"
            pb={{ base: 3, md: 4 }}
          >
            <Heading
              as="h6"
              variant="h6"
              overflow="hidden"
              fontWeight={name.length ? 600 : 300}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
              color={name.length ? "text.primary" : "text.disabled"}
            >
              {name.length ? name : "Untitled collection"}
            </Heading>
            {description && (
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
            )}
          </Flex>
          <Flex flexWrap="wrap" mt={{ md: 2 }}>
            <Flex direction="column" flex={1} minW="fit-content">
              <Text variant="body2" color="text.dark">
                Created by
              </Text>
              <ExplorerLink
                value={collectionInfo.creator}
                type="user_address"
                showCopyOnHover={!isMobile}
                minW={36}
                ampCopierSection="collection-list"
              />
            </Flex>
            <Flex direction="column" flex={1} minW="fit-content">
              <Text color="text.dark" variant="body2">
                Collection Address
              </Text>
              <ExplorerLink
                value={collectionInfo.collectionAddress}
                type="contract_address"
                showCopyOnHover={!isMobile}
                minW={36}
                ampCopierSection="collection-list"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
