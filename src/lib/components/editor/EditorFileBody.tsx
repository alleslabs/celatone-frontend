import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { SourceTreeNode } from "./types";
import { CustomIcon } from "../icon";

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
      <>
        {initialFilePath === node.path && (
          <CustomIcon name="star-solid" color="secondary.main" boxSize={3} />
        )}
        <CustomIcon name="code-file" color="gray.600" boxSize={3.5} />
      </>
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
