import type { Nullable } from "lib/types";

import { Box, Grid, Stack, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { useEffect, useState } from "react";

import type { FullEditorSidebarMobileProps } from "./FullEditorSidebarMobile";
import type { FilePath, SourceTreeNode } from "./types";

import { Editor } from "./Editor";
import { EditorSidebar } from "./EditorSidebar";
import { EditorTop } from "./EditorTop";
import { FullEditorSidebarMobile } from "./FullEditorSidebarMobile";
import { generateSourceTree } from "./helpers";

interface FullEditorProps
  extends Pick<FullEditorSidebarMobileProps, "isOpen" | "onClose"> {
  filesPath: FilePath[];
  initialFilePath: string;
  libraryFilesPath: string[];
}

export const FullEditor = ({
  filesPath,
  initialFilePath,
  libraryFilesPath,
  isOpen,
  onClose,
}: FullEditorProps) => {
  const isMobile = useMobile();
  const [filesList, setFilesList] = useState<SourceTreeNode[]>([]);
  const [selectedFile, setSelectedFile] =
    useState<Nullable<SourceTreeNode>>(null);
  const generatedSourceTree = generateSourceTree(
    filesPath,
    initialFilePath,
    libraryFilesPath
  );

  const handleFindInitialFile = (tree: SourceTreeNode[]) => {
    return tree.forEach((node) => {
      if (node.path === initialFilePath) {
        setFilesList([node]);
        setSelectedFile(node);
        return node;
      } else if (node.children.length > 0) {
        handleFindInitialFile(node.children);
      }

      return undefined;
    });
  };

  useEffect(() => {
    handleFindInitialFile(generatedSourceTree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFilesList]);

  const handleUpdateFilesList = (node: SourceTreeNode) => {
    setSelectedFile(node);
    onClose();
    const foundNode = filesList.find((n) => n.path === node.path);
    if (foundNode) return;
    setFilesList([...filesList, node]);
  };

  const handleOnRemove = (node: SourceTreeNode, index: number) => {
    const filteredFiles = filesList.filter((_, i) => i !== index);
    setFilesList(filteredFiles);
    if (selectedFile?.path === node.path)
      setSelectedFile(filteredFiles[filteredFiles.length - 1]);
  };

  return (
    <Grid
      gridTemplateColumns={{
        base: "1fr",
        md: "200px 1fr",
      }}
    >
      {isMobile ? (
        <FullEditorSidebarMobile
          initialFilePath={initialFilePath}
          isOpen={isOpen}
          selectedFile={selectedFile}
          sourceTreeNode={generatedSourceTree}
          onClick={handleUpdateFilesList}
          onClose={onClose}
        />
      ) : (
        <Stack bg="gray.900" gap={1} height="472px" pt={4} px={4}>
          <Text variant="body2">Files</Text>
          <Box flexGrow={1} overflow="auto" pb={4}>
            <EditorSidebar
              initialFilePath={initialFilePath}
              selectedFile={selectedFile}
              sourceTreeNode={generatedSourceTree}
              onClick={handleUpdateFilesList}
            />
          </Box>
        </Stack>
      )}
      <Box>
        <EditorTop
          filesList={filesList}
          initialFilePath={initialFilePath}
          selectedFile={selectedFile}
          onClick={(index) => setSelectedFile(filesList[index])}
          onRemove={handleOnRemove}
        />
        <Editor
          language={selectedFile?.language}
          value={selectedFile?.code ?? ""}
        />
      </Box>
    </Grid>
  );
};
