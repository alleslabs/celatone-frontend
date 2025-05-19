import type { Collection } from "lib/services/types";

import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useMetadata } from "lib/services/nft";

interface CollectionCardProps {
  collectionInfo: Collection;
}

export const CollectionCard = ({ collectionInfo }: CollectionCardProps) => {
  const isMobile = useMobile();
  const { description, name, uri } = collectionInfo;
  const { data: metadata } = useMetadata(uri);

  return (
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
          src={metadata?.image}
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
                {description}
              </Text>
            )}
          </Flex>
          <Flex flexWrap="wrap" mt={{ md: 2 }}>
            {collectionInfo.creator && (
              <Flex direction="column" flex={1} minW="fit-content">
                <Text color="text.dark" variant="body2">
                  Created by
                </Text>
                <ExplorerLink
                  ampCopierSection="collection-list"
                  minW={36}
                  showCopyOnHover={!isMobile}
                  type="user_address"
                  value={collectionInfo.creator}
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
                value={collectionInfo.collectionAddress}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
