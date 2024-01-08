import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { NFT_IMAGE_PLACEHOLDER } from "lib/data/image";
import { useMetadata } from "lib/services/nft";
import type { Collection } from "lib/services/nft/collection";

const CollectionCard = ({ collectionInfo }: { collectionInfo: Collection }) => {
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
      <Flex gap="24px" alignItems="center" maxW="full" w="full">
        {metadata?.image ? (
          <Image
            minW="150px"
            h="150px"
            borderRadius="8px"
            src={metadata?.image}
          />
        ) : (
          <Image
            minW="150px"
            h="150px"
            borderRadius="8px"
            src={NFT_IMAGE_PLACEHOLDER}
          />
        )}
        <Flex direction="column" gap={2} overflowX="hidden">
          <Heading as="h6" variant="h6" fontWeight={600} className="ellipsis">
            {name}
          </Heading>
          <Text
            color="text.dark"
            variant="body2"
            fontWeight={400}
            overflow="hidden"
            textOverflow="ellipsis"
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

export default CollectionCard;
