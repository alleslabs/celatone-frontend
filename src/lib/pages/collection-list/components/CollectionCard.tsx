import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data/image";
import type { Collection } from "lib/services/collection";
import { useMetadata } from "lib/services/nftService";

const CollectionCard = ({ collectionInfo }: { collectionInfo: Collection }) => {
  const { uri, description, name } = collectionInfo;
  const { data: metadata } = useMetadata(uri);
  const isMobile = useMobile();

  return (
    <Box p={isMobile ? "12px" : "16px 24px"} bg="gray.900" borderRadius="8px">
      <Flex gap="24px" alignItems="center">
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

        <Stack spacing="16px">
          <Text
            fontSize="18px"
            maxW={isMobile ? "100px" : "200px"}
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
