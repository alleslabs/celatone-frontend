import type { ContractLocalInfo } from "lib/stores/contract";

import { Flex, Tag, Text } from "@chakra-ui/react";
import { getTagsDefault } from "lib/utils";
import { useState } from "react";

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
      position="relative"
      w="full"
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseEnter}
    >
      <Flex
        color="text.dark"
        gap={1}
        opacity={isHover ? "0" : "1"}
        onClick={(e) => {
          if (!isReadOnly) e.stopPropagation();
        }}
      >
        {tags.length ? (
          <Tag size={tagSize}>{tags[0]}</Tag>
        ) : (
          <Text variant="body2" color="text.dark">
            Not tagged
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
          bgColor={tags.length > 1 ? "gray.800" : "inherit"}
          borderRadius="8px"
          left="-16px"
          position="absolute"
          py={4}
          top="-16px"
          w="340px"
          zIndex="dropdown"
          onClick={(e) => {
            if (!isReadOnly) e.stopPropagation();
          }}
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
                Not tagged
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
