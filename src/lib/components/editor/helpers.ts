import { last, split } from "lodash";
import { EXTENSION_LIB, FilePath, SourceTreeNode } from "./types";

export const generateSourceTree = (filesPath: FilePath[]): SourceTreeNode[] => {
  const root: SourceTreeNode[] = [];

  filesPath.forEach(({ path, code }) => {
    const parts = path.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        const extension = last(split(part, "."));
        const isFolder = extension ? !EXTENSION_LIB.includes(extension) : false;

        existingNode = {
          name: part,
          isOpen: index === 0 ? true : false,
          children: [],
          isFolder,
          treeLevel: index,
          code,
          path: parts.slice(0, index + 1).join("/"),
        };
        currentLevel.push(existingNode);
      }

      currentLevel = existingNode.children;
    });
  });

  return root;
};
