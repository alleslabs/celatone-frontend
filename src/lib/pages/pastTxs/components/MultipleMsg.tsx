import { Flex, Tag } from "@chakra-ui/react";
import { snakeCase } from "snake-case";

interface MultipleMsgProps {
  type: string;
  tags?: Array<string>;
  length: number;
  text: string;
}

export const MultipleMsg = ({ type, tags, length, text }: MultipleMsgProps) => {
  return (
    <Flex gap={1} alignItems="center">
      {type}
      {tags &&
        tags.map((tag: string, index: number) => (
          <Tag key={index.toString() + tag} borderRadius="full">
            {snakeCase(tag)}
          </Tag>
        ))}
      {tags && length - tags.length > 0 ? (
        <Tag borderRadius="full">+{length - tags.length} </Tag>
      ) : (
        <Tag borderRadius="full">{length}</Tag>
      )}
      {/* For Execute */}
      {tags && tags.length && "on"} {text}
    </Flex>
  );
};
