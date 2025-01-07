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
  const { description, name, uri } = collectionInfo;
  const { data: metadata } = useMetadata(uri);

  return (
    <Box
      bg="gray.900"
      h="full"
      p={{ base: 3, md: 6 }}
      _hover={{
        bg: "gray.800",
      }}
      borderRadius="8px"
      transition="all .25s ease-in-out"
    >
      <Flex gap={{ base: 4, md: 6 }} maxW="full" w="full" overflow="hidden">
        <Image
          fallbackSrc={NFT_IMAGE_PLACEHOLDER}
          fallbackStrategy="beforeLoadOrError"
          h={{ base: 28, md: 40 }}
          minW={{ base: 28, md: 40 }}
          src={metadata?.image}
          w={{ base: 28, md: 40 }}
          background="gray.900"
          backgroundPosition="center"
          borderRadius="8px"
          objectFit="contain"
        />
        <Flex
          alignSelf="center"
          gap={2}
          w="full"
          direction="column"
          overflow="hidden"
        >
          <Flex
            gap={1}
            pb={{ base: 3, md: 4 }}
            borderBottom="1px solid"
            borderBottomColor="gray.700"
            direction="column"
          >
            <Heading
              as="h6"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
              variant="h6"
              color={name.length ? "text.primary" : "text.disabled"}
              fontWeight={name.length ? 600 : 300}
              overflow="hidden"
            >
              {name.length ? name : "Untitled Collection"}
            </Heading>
            {description && (
              <Text
                lineHeight="125%"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
                variant={{ base: "body3", md: "body2" }}
                color="text.dark"
                fontWeight={400}
                overflow="hidden"
                textOverflow="ellipsis"
                wordBreak="break-word"
              >
                {description}
              </Text>
            )}
          </Flex>
          <Flex flexWrap="wrap" mt={{ md: 2 }}>
            <Flex flex={1} minW="fit-content" direction="column">
              <Text variant="body2" color="text.dark">
                Created by
              </Text>
              <ExplorerLink
                minW={36}
                type="user_address"
                value={collectionInfo.creator}
                ampCopierSection="collection-list"
                showCopyOnHover={!isMobile}
              />
            </Flex>
            <Flex flex={1} minW="fit-content" direction="column">
              <Text variant="body2" color="text.dark">
                Collection Address
              </Text>
              <ExplorerLink
                minW={36}
                type="contract_address"
                value={collectionInfo.collectionAddress}
                ampCopierSection="collection-list"
                showCopyOnHover={!isMobile}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
