import { Flex, Tag, TagLabel, Text } from "@chakra-ui/react";
import { useState } from "react";

import { EditTags } from "lib/components/modal/EditTags";
import type { ContractLocalInfo } from "lib/stores/contract";

interface TagsCellProps {
  contractLocalInfo: ContractLocalInfo;
  isReadOnly?: boolean;
}

export const TagsCell = ({
  contractLocalInfo,
  isReadOnly = false,
}: TagsCellProps) => {
  const tags = contractLocalInfo.tags ?? [];
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
        onClick={(e) => e.stopPropagation()}
      >
        {tags.length ? (
          tags.slice(0, 2).map((tag) => {
            return (
              <Tag
                borderRadius="full"
                variant="solid"
                bgColor="info.dark"
                color="text.main"
                key={tag}
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            );
          })
        ) : (
          <Text variant="body2" color="text.dark">
            Not Tagged
          </Text>
        )}
        <Tag
          borderRadius="full"
          variant="solid"
          colorScheme="gray"
          display={tags.length > 2 ? "flex" : "none"}
        >
          <TagLabel>{tags.length - 2}+</TagLabel>
        </Tag>
      </Flex>

      {isHover && (
        <Flex
          bgColor={tags.length > 2 ? "gray.800" : "inherit"}
          py={4}
          borderRadius="md"
          position="absolute"
          top="-16px"
          left="-16px"
          onClick={(e) => e.stopPropagation()}
        >
          <Flex gap={1} px={4} alignItems="center">
            {tags.length ? (
              tags.map((item) => {
                return (
                  <Tag
                    key={item}
                    borderRadius="full"
                    variant="solid"
                    bgColor="info.dark"
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
