import { last, split } from "lodash";
import { EXTENSION_LIB, FilePath, SourceTreeNode } from "./types";

export const generateSourceTree = (
  filesPath: FilePath[],
  initialFilePath: string,
  libraryFilesPath: string[]
): SourceTreeNode[] => {
  const root: SourceTreeNode[] = [];

  filesPath.forEach(({ path, code }) => {
    const parts = path.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        const extension = last(split(part, "."));
        const isFolder = extension ? !EXTENSION_LIB.includes(extension) : false;
        const isLib = !isFolder && libraryFilesPath.includes(path);
        const isInitializeNodePath = initialFilePath === path;
        const isOpen = index === 0 ? true : false || isInitializeNodePath;

        existingNode = {
          name: part,
          isOpen,
          children: [],
          isFolder,
          isLib,
          treeLevel: index,
          code,
          path: parts.slice(0, index + 1).join("/"),
          language: extension === "vy" ? "python" : extension,
        };
        currentLevel.push(existingNode);
      }

      currentLevel = existingNode.children;
    });
  });

  return root;
};
