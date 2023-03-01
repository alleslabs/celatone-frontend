import { Flex, Tag, TagLabel, Text } from "@chakra-ui/react";
import { useState } from "react";

import type { ContractLocalInfo } from "lib/stores/contract";
import { getTagsDefault } from "lib/utils";

import { EditTags } from "./EditTags";

interface TagsCellProps {
  contractLocalInfo: ContractLocalInfo;
  isReadOnly?: boolean;
}

export const TagsCell = ({
  contractLocalInfo,
  isReadOnly = false,
}: TagsCellProps) => {
  const tags = getTagsDefault(contractLocalInfo.tags);
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseOut = () => {
    setIsHover(false);
  };

  return (
    <Flex
      w="full"
      position="relative"
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseOut}
    >
      <Flex
        gap={1}
        color="text.dark"
        opacity={isHover ? "0" : "1"}
        onClick={(e) => {
          if (!isReadOnly) e.stopPropagation();
        }}
      >
        {tags.length ? (
          <Tag
            borderRadius="full"
            variant="solid"
            bgColor="honeydew.darker"
            color="text.main"
          >
            <TagLabel>{tags.at(0)}</TagLabel>
          </Tag>
        ) : (
          <Text variant="body2" color="text.dark">
            Not Tagged
          </Text>
        )}
        <Tag
          borderRadius="full"
          variant="solid"
          colorScheme="gray"
          display={tags.length > 1 ? "flex" : "none"}
        >
          <TagLabel>{tags.length - 1}+</TagLabel>
        </Tag>
      </Flex>

      {isHover && (
        <Flex
          bgColor={tags.length > 1 ? "pebble.800" : "inherit"}
          py={4}
          borderRadius="8px"
          position="absolute"
          w="340px"
          top="-16px"
          left="-16px"
          onClick={(e) => {
            if (!isReadOnly) e.stopPropagation();
          }}
          zIndex="dropdown"
        >
          <Flex
            gap={1}
            px={4}
            alignItems="center"
            maxW="full"
            display="flex"
            flexWrap="wrap"
            rowGap={2}
          >
            {tags.length ? (
              tags.map((item) => {
                return (
                  <Tag
                    key={item}
                    borderRadius="full"
                    variant="solid"
                    bgColor="honeydew.darker"
                    color="text.main"
                  >
                    <TagLabel>{item}</TagLabel>
                  </Tag>
                );
              })
            ) : (
              <Text variant="body2" color="text.dark">
                Not Tagged
              </Text>
            )}
            {!isReadOnly && (
              <Flex display={isHover ? "flex" : "none"}>
                <EditTags contractLocalInfo={contractLocalInfo} />
              </Flex>
            )}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
