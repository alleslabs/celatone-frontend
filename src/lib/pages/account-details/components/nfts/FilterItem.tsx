import type { Option } from "lib/types";

import { Badge, Flex, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { NftImage } from "lib/components/nft/NftImage";
import { useMetadata } from "lib/services/nft";

interface FilterItemProps {
  collectionName: Option<string>;
  count: number;
  isActive?: boolean;
  isDefault?: boolean;
  onClick: () => void;
  uri?: string;
}

export const FilterItem = ({
  collectionName,
  count,
  isActive,
  isDefault = false,
  onClick,
  uri,
}: FilterItemProps) => {
  const { data: metadata } = useMetadata({ uri });

  return (
    <Flex
      _hover={{ bg: "gray.800" }}
      align="center"
      bg={isActive ? "gray.800" : "gray.900"}
      borderRadius="8px"
      cursor="pointer"
      justify="space-between"
      p="12px"
      onClick={() => {
        track(AmpEvent.USE_SELECT_NFT_COLLECTION_GROUP, {
          collectionName,
          nftsCount: count,
        });
        onClick();
      }}
    >
      <Flex align="center" gap="8px">
        {isDefault ? (
          <Flex
            background="gray.800"
            borderRadius="4px"
            height="32px"
            p={1}
            width="32px"
          >
            <CustomIcon name="collection" />
          </Flex>
        ) : (
          <NftImage
            borderRadius="4px"
            height="32px"
            src={metadata?.image}
            width="32px"
          />
        )}
        <Text className="ellipsis" fontSize="14px" width="150px">
          {collectionName}
        </Text>
      </Flex>
      <Badge>{count}</Badge>
    </Flex>
  );
};
