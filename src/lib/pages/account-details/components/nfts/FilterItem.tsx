import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { useMetadata } from "lib/services/nft";

interface FilterItemProps {
  collectionName: string;
  count: number;
  onClick: () => void;
  uri?: string;
  isActive?: boolean;
}

export const FilterItem = ({
  collectionName,
  count,
  onClick,
  uri,
  isActive,
}: FilterItemProps) => {
  const { data: metadata } = useMetadata(uri ?? "");

  return (
    <Flex
      p="12px"
      bg={isActive ? "gray.800" : "gray.900"}
      borderRadius="8px"
      _hover={{ bg: "gray.800" }}
      cursor="pointer"
      onClick={() => {
        track(AmpEvent.USE_SELECT_NFT_COLLECTION_GROUP, {
          collectionName,
          nftsCount: count,
        });
        onClick();
      }}
      align="center"
      justify="space-between"
    >
      <Flex gap="8px" align="center">
        {metadata && uri ? (
          <Image
            width="32px"
            height="32px"
            borderRadius="8px"
            src={metadata?.image}
          />
        ) : (
          <Box width="32px">
            <CustomIcon name="group" />
          </Box>
        )}
        <Text fontSize="14px" width="150px" className="ellipsis">
          {collectionName}
        </Text>
      </Flex>
      <Badge>{count}</Badge>
    </Flex>
  );
};
