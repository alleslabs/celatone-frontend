import { Flex, Tag, Text } from "@chakra-ui/react";
import { useState } from "react";

import type { ContractLocalInfo } from "lib/stores/contract";
import { getTagsDefault } from "lib/utils";

import { EditTags } from "./EditTags";

interface TagsCellProps {
  contractLocalInfo: ContractLocalInfo;
  isReadOnly?: boolean;
  tagSize?: string;
}

export const TagsCell = ({
  contractLocalInfo,
  isReadOnly = false,
  tagSize = "md",
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
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseEnter}
      position="relative"
    >
      <Flex
        gap={1}
        color="text.dark"
        onClick={(e) => {
          if (!isReadOnly) e.stopPropagation();
        }}
        opacity={isHover ? "0" : "1"}
      >
        {tags.length ? (
          <Tag size={tagSize}>{tags[0]}</Tag>
        ) : (
          <Text variant="body2" color="text.dark">
            Not Tagged
          </Text>
        )}
        <Tag
          display={tags.length > 1 ? "flex" : "none"}
          size={tagSize}
          variant="gray"
        >
          {tags.length - 1}+
        </Tag>
      </Flex>

      {isHover && (
        <Flex
          left="-16px"
          py={4}
          w="340px"
          zIndex="dropdown"
          bgColor={tags.length > 1 ? "gray.800" : "inherit"}
          borderRadius="8px"
          onClick={(e) => {
            if (!isReadOnly) e.stopPropagation();
          }}
          position="absolute"
          top="-16px"
        >
          <Flex
            alignItems="center"
            display="flex"
            flexWrap="wrap"
            gap={1}
            maxW="full"
            px={4}
            rowGap={2}
          >
            {tags.length ? (
              tags.map((item) => {
                return (
                  <Tag key={item} size={tagSize}>
                    {item}
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
