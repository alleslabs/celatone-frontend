import { Box, Grid, Stack, Text } from "@chakra-ui/react";
import { generateSourceTree } from "./helpers";
import { FilePath, SourceTreeNode } from "./types";
import { EditorSidebar } from "./EditorSidebar";
import { useEffect, useState } from "react";
import { EditorTop } from "./EditorTop";
import { Nullable } from "lib/types";
import { Editor } from "./Editor";

interface FullEditorProps {
  filesPath: FilePath[];
  initialFilePath: string;
}

export const FullEditor = ({ filesPath, initialFilePath }: FullEditorProps) => {
  const [filesList, setFilesList] = useState<SourceTreeNode[]>([]);
  const [selectedFile, setSelectedFile] =
    useState<Nullable<SourceTreeNode>>(null);
  const generatedSourceTree = generateSourceTree(filesPath);

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
    <Grid gridTemplateColumns="200px 1fr">
      <Stack gap={1} px={4} pt={4} bg="gray.900" height="472px">
        <Text variant="body2">Files</Text>
        <Box overflow="auto" flexGrow={1} pb={4}>
          <EditorSidebar
            initialFilePath={initialFilePath}
            sourceTreeNode={generatedSourceTree}
            onClick={handleUpdateFilesList}
            selectedFile={selectedFile}
          />
        </Box>
      </Stack>
      <Box>
        <EditorTop
          selectedFile={selectedFile}
          onClick={(index) => setSelectedFile(filesList[index])}
          onRemove={handleOnRemove}
          filesList={filesList}
          initialFilePath={initialFilePath}
        />
        <Editor language="sol" value={selectedFile?.code ?? ""} />
      </Box>
    </Grid>
  );
};
