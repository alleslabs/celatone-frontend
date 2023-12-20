import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";

import type { Collection } from "lib/services/collection";
import { useMetadata } from "lib/services/nftService";

const CollectionCard = ({ collectionInfo }: { collectionInfo: Collection }) => {
  const { uri, description, name } = collectionInfo;
  const { data: metadata } = useMetadata(uri);

  return (
    <Box p="16px 24px" bg="gray.900" borderRadius="8px">
      <Flex gap="24px" alignItems="center">
        {metadata?.image ? (
          <Box w="150px" h="150px">
            <Image
              minW="150px"
              minH="150px"
              borderRadius="8px"
              src={metadata?.image}
            />
          </Box>
        ) : (
          <Box minW="150px" minH="150px" borderRadius="8px" bg="gray.800" />
        )}

        <Stack spacing="16px">
          <Text
            fontSize="18px"
            maxW="200px"
            fontWeight={600}
            className="ellipsis"
          >
            {name}
          </Text>
          <Text
            h="52px"
            color="gray.400"
            fontSize="12px"
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
        </Stack>
      </Flex>
    </Box>
  );
};

export default CollectionCard;
