import { Badge, Flex, Image, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useMetadata } from "lib/services/nft";
import type { Option } from "lib/types";

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
  const { data: metadata } = useMetadata(uri ?? "");

  return (
    <Flex
      align="center"
      bg={isActive ? "gray.800" : "gray.900"}
      justify="space-between"
      p="12px"
      _hover={{ bg: "gray.800" }}
      borderRadius="8px"
      cursor="pointer"
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
            fallbackSrc={NFT_IMAGE_PLACEHOLDER}
            fallbackStrategy="beforeLoadOrError"
            height="32px"
            src={metadata?.image}
            borderRadius="4px"
          />
        )}
        <Text width="150px" className="ellipsis" fontSize="14px">
          {collectionName}
        </Text>
      </Flex>
      <Badge>{count}</Badge>
    </Flex>
  );
};
