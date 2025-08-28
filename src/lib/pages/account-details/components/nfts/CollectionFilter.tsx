import type { HexAddr32, Option } from "lib/types";

import { Badge, Flex, Image, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useGetFirstNftAsCollectionImage } from "lib/hooks";
import { useMetadata } from "lib/services/nft";

const COMMON_STYLES = {
  container: {
    _hover: { bg: "gray.800" },
    align: "center" as const,
    borderRadius: "8px",
    cursor: "pointer" as const,
    justify: "space-between" as const,
    p: "12px",
  },
  image: {
    borderRadius: "4px",
    height: "32px",
    width: "32px",
  },
  imageContainer: {
    align: "center" as const,
    gap: "8px",
  },
  text: {
    className: "ellipsis",
    fontSize: "14px",
    width: "150px",
  },
};

const handleClick = (
  onClick: () => void,
  collectionName: Option<string>,
  count?: number
) => {
  track(AmpEvent.USE_SELECT_NFT_COLLECTION_GROUP, {
    collectionName,
    nftsCount: count,
  });
  onClick();
};

interface CollectionFilterProps {
  collectionAddress: HexAddr32;
  collectionName: Option<string>;
  count?: number;
  isActive?: boolean;
  onClick: () => void;
  uri?: string;
}

export const CollectionFilter = ({
  collectionAddress,
  collectionName,
  count,
  isActive,
  onClick,
  uri,
}: CollectionFilterProps) => {
  const firstNftImage = useGetFirstNftAsCollectionImage(collectionAddress);
  const { data: metadata } = useMetadata({ uri });

  const collectionImage = collectionAddress ? firstNftImage : metadata?.image;

  return (
    <Flex
      {...COMMON_STYLES.container}
      aria-label={`Select collection ${collectionName || "Unknown"} with ${count || 0} NFTs`}
      bg={isActive ? "gray.800" : "gray.900"}
      role="button"
      tabIndex={0}
      onClick={() => handleClick(onClick, collectionName, count)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(onClick, collectionName, count);
        }
      }}
    >
      <Flex {...COMMON_STYLES.imageContainer}>
        <Image
          {...COMMON_STYLES.image}
          alt={`${collectionName || "Collection"} image`}
          fallbackSrc={NFT_IMAGE_PLACEHOLDER}
          fallbackStrategy="beforeLoadOrError"
          src={collectionImage}
        />
        <Text {...COMMON_STYLES.text}>{collectionName}</Text>
      </Flex>
      {count && <Badge>{count}</Badge>}
    </Flex>
  );
};

interface CollectionFilterDefaultProps {
  collectionName: Option<string>;
  count?: number;
  isActive?: boolean;
  onClick: () => void;
}

export const CollectionFilterDefault = ({
  collectionName,
  count,
  isActive,
  onClick,
}: CollectionFilterDefaultProps) => (
  <Flex
    {...COMMON_STYLES.container}
    aria-label={`Select collection ${collectionName || "Unknown"} with ${count || 0} NFTs`}
    bg={isActive ? "gray.800" : "gray.900"}
    role="button"
    tabIndex={0}
    onClick={() => handleClick(onClick, collectionName, count)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(onClick, collectionName, count);
      }
    }}
  >
    <Flex {...COMMON_STYLES.imageContainer}>
      <Flex background="gray.800" {...COMMON_STYLES.image} p={1}>
        <CustomIcon name="collection" />
      </Flex>
      <Text {...COMMON_STYLES.text}>{collectionName}</Text>
    </Flex>
    {count && <Badge>{count}</Badge>}
  </Flex>
);
