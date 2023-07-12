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
          <Tag size={tagSize}>{tags.at(0)}</Tag>
        ) : (
          <Text variant="body2" color="text.dark">
            Not Tagged
          </Text>
        )}
        <Tag
          size={tagSize}
          variant="gray"
          display={tags.length > 1 ? "flex" : "none"}
        >
          {tags.length - 1}+
        </Tag>
      </Flex>

      {isHover && (
        <Flex
          bgColor={tags.length > 1 ? "gray.800" : "inherit"}
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
                  <Tag size={tagSize} key={item}>
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
