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
  node,
  initialFilePath,
  isNoWrap,
  ...props
}: EditorFileBodyProps) => (
  <Flex gap={0.5} alignItems="center" {...props}>
    {node.isFolder ? (
      <>
        <CustomIcon
          cursor="pointer"
          name="chevron-down"
          color="gray.600"
          boxSize={3}
          transform={node.isOpen ? "rotate(0deg)" : "rotate(-90deg)"}
        />
        <CustomIcon name="folder" color="primary.main" boxSize={3} />
      </>
    ) : (
      <Flex
        alignItems="center"
        pl={node.treeLevel === 0 && node.path === initialFilePath ? 2 : 0}
      >
        {initialFilePath === node.path && (
          <Tooltip label="Main verified contract file">
            <CustomIcon name="star-solid" color="secondary.main" boxSize={3} />
          </Tooltip>
        )}
        {node.isLib ? (
          <Tooltip label="Library contract">
            <CustomIcon name="document" color="gray.600" boxSize={3} />
          </Tooltip>
        ) : (
          <CustomIcon name="code-file" color="gray.600" boxSize={3.5} />
        )}
      </Flex>
    )}
    <Text
      variant="body2"
      noOfLines={!isNoWrap ? 1 : undefined}
      whiteSpace={!isNoWrap ? "normal" : "nowrap"}
    >
      {node.name}
    </Text>
  </Flex>
);
