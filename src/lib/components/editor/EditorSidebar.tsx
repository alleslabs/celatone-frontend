import type { Nullable } from "lib/types";

import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import type { SourceTreeNode } from "./types";

import { EditorFileBody } from "./EditorFileBody";

export interface EditorSidebarProps {
  sourceTreeNode: SourceTreeNode[];
  selectedFile: Nullable<SourceTreeNode>;
  initialFilePath: string;
  onClick: (node: SourceTreeNode) => void;
}

const EditorSidebarSelectedMark = () => (
  <Flex
    alignItems="center"
    bottom={0}
    height="full"
    left={0}
    position="absolute"
    top={0}
  >
    <Box bgColor="primary.main" h={5} rounded={8} w={1} />
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
          bgColor={`${node.treeLevel === 0 ? "transparent" : "gray.700"}`}
          h="full"
          left={`${node.treeLevel * 8}px`}
          position="absolute"
          w="1px"
          zIndex={1}
        />
        <Box
          _hover={{
            bg: "gray.800",
            cursor: "pointer",
          }}
          bgColor={isSelected ? "gray.800" : "transparent"}
          borderRadius={4}
          position="relative"
          onClick={() => (node.isFolder ? onUpdateIsOpen(node) : onClick(node))}
        >
          {isSelected && <EditorSidebarSelectedMark />}
          <EditorFileBody
            initialFilePath={initialFilePath}
            node={node}
            pl={`${node.treeLevel * 8}px`}
            py={1}
          />
        </Box>
        {node.children.length > 0 && node.isOpen && (
          <EditorSidebar
            initialFilePath={initialFilePath}
            selectedFile={selectedFile}
            sourceTreeNode={node.children}
            onClick={onClick}
          />
        )}
      </Box>
    );
  });
};
