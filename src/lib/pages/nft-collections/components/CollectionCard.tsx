import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

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
      bg="gray.900"
      borderRadius="8px"
      transition="all .25s ease-in-out"
      _hover={{
        bg: "gray.800",
      }}
    >
      <Flex
        gap="24px"
        alignItems="center"
        maxW="full"
        w="full"
        overflow="hidden"
      >
        <Image
          minW={{ base: 28, md: 40 }}
          w={{ base: 28, md: 40 }}
          h={{ base: 28, md: 40 }}
          objectFit="cover"
          backgroundPosition="center"
          borderRadius="8px"
          src={metadata?.image ? metadata?.image : NFT_IMAGE_PLACEHOLDER}
        />
        <Flex direction="column" gap={2} overflow="hidden" w="full">
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
        </Flex>
      </Flex>
    </Box>
  );
};
