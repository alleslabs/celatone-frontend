import { Badge, Flex, Image, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useMetadata } from "lib/services/nft";
import type { Nullable } from "lib/types";

interface FilterItemProps {
  collectionName: Nullable<string>;
  count: number;
  onClick: () => void;
  uri?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export const FilterItem = ({
  collectionName,
  count,
  onClick,
  uri,
  isActive,
  isDefault = false,
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
        {isDefault ? (
          <Flex
            width="32px"
            height="32px"
            p={1}
            background="gray.800"
            borderRadius="4px"
          >
            <CustomIcon name="collection" />
          </Flex>
        ) : (
          <Image
            width="32px"
            height="32px"
            borderRadius="4px"
            src={metadata?.image}
            fallbackSrc={NFT_IMAGE_PLACEHOLDER}
            fallbackStrategy="beforeLoadOrError"
          />
        )}
        <Text fontSize="14px" width="150px" className="ellipsis">
          {collectionName}
        </Text>
      </Flex>
      <Badge>{count}</Badge>
    </Flex>
  );
};
