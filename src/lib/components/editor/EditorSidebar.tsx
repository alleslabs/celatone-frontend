import { useState } from "react";
import type { SourceTreeNode } from "./types";
import { Box, Flex } from "@chakra-ui/react";
import { EditorFileBody } from "./EditorFileBody";
import type { Nullable } from "lib/types";

export interface EditorSidebarProps {
  sourceTreeNode: SourceTreeNode[];
  selectedFile: Nullable<SourceTreeNode>;
  initialFilePath: string;
  onClick: (node: SourceTreeNode) => void;
}

const EditorSidebarSelectedMark = () => (
  <Flex
    alignItems="center"
    position="absolute"
    left={0}
    height="full"
    top={0}
    bottom={0}
  >
    <Box rounded={8} bgColor="primary.main" h={5} w={1} />
  </Flex>
);

export const EditorSidebar = ({
  sourceTreeNode,
  initialFilePath,
  onClick,
  selectedFile,
}: EditorSidebarProps) => {
  const [tree, setTree] = useState(sourceTreeNode);

  const handleUpdateIsOpen = (
    node: SourceTreeNode,
    tree: SourceTreeNode[]
  ): SourceTreeNode[] =>
    tree.map((n) => {
      if (n.path === node.path) {
        return { ...n, isOpen: !n.isOpen };
      }

      return { ...n, children: handleUpdateIsOpen(node, n.children) };
    });

  const onUpdateIsOpen = (node: SourceTreeNode) => {
    const updatedTree = handleUpdateIsOpen(node, tree);
    setTree(updatedTree);
  };

  return tree.map((node) => {
    const isSelected = node.path === selectedFile?.path;

    return (
      <Box key={`${node.path}-editor-sidebar`} position="relative">
        <Box
          position="absolute"
          h="full"
          w="1px"
          bgColor={`${node.treeLevel === 0 ? "transparent" : "gray.700"}`}
          left={`${node.treeLevel * 8}px`}
          zIndex={1}
        />
        <Box
          position="relative"
          _hover={{
            bg: "gray.800",
            cursor: "pointer",
          }}
          bgColor={isSelected ? "gray.800" : "transparent"}
          borderRadius={4}
          onClick={() => (node.isFolder ? onUpdateIsOpen(node) : onClick(node))}
        >
          {isSelected && <EditorSidebarSelectedMark />}
          <EditorFileBody
            node={node}
            initialFilePath={initialFilePath}
            py={1}
            pl={`${node.treeLevel * 8}px`}
          />
        </Box>
        {node.children.length > 0 && node.isOpen && (
          <EditorSidebar
            initialFilePath={initialFilePath}
            sourceTreeNode={node.children}
            onClick={onClick}
            selectedFile={selectedFile}
          />
        )}
      </Box>
    );
  });
};
