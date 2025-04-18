import type { FlexProps } from "@chakra-ui/react";

import { Flex, Text } from "@chakra-ui/react";

import type { SourceTreeNode } from "./types";

import { CustomIcon } from "../icon";
import { Tooltip } from "../Tooltip";

interface EditorFileBodyProps extends FlexProps {
  node: SourceTreeNode;
  initialFilePath: string;
  isNoWrap?: boolean;
}

export const EditorFileBody = ({
  initialFilePath,
  isNoWrap,
  node,
  ...props
}: EditorFileBodyProps) => (
  <Flex alignItems="center" gap={0.5} {...props}>
    {node.isFolder ? (
      <>
        <CustomIcon
          boxSize={3}
          color="gray.600"
          cursor="pointer"
          name="chevron-down"
          transform={node.isOpen ? "rotate(0deg)" : "rotate(-90deg)"}
        />
        <CustomIcon boxSize={3} color="primary.main" name="folder" />
      </>
    ) : (
      <Flex
        alignItems="center"
        pl={node.treeLevel === 0 && node.path === initialFilePath ? 2 : 0}
      >
        {initialFilePath === node.path && (
          <Tooltip label="Main verified contract file">
            <CustomIcon boxSize={3} color="secondary.main" name="star-solid" />
          </Tooltip>
        )}
        {node.isLib ? (
          <Tooltip label="Library contract">
            <CustomIcon boxSize={3} color="gray.600" name="document" />
          </Tooltip>
        ) : (
          <CustomIcon boxSize={3.5} color="gray.600" name="code-file" />
        )}
      </Flex>
    )}
    <Text
      noOfLines={!isNoWrap ? 1 : undefined}
      variant="body2"
      whiteSpace={!isNoWrap ? "normal" : "nowrap"}
    >
      {node.name}
    </Text>
  </Flex>
);
