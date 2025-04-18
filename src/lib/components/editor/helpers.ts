import { last, split } from "lodash";

import type { FilePath, SourceTreeNode } from "./types";

import { EXTENSION_LIB } from "./types";

export const generateSourceTree = (
  filesPath: FilePath[],
  initialFilePath: string,
  libraryFilesPath: string[]
): SourceTreeNode[] => {
  const root: SourceTreeNode[] = [];

  filesPath.forEach(({ code, path }) => {
    const parts = path.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        const extension = last(split(part, "."));
        const isFolder = extension ? !EXTENSION_LIB.includes(extension) : false;
        const isLib = !isFolder && libraryFilesPath.includes(path);
        const isInitializeNodePath = initialFilePath === path;
        const isOpen = index === 0 ? true : isInitializeNodePath;

        existingNode = {
          children: [],
          code,
          isFolder,
          isLib,
          isOpen,
          language: extension === "vy" ? "python" : extension,
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          treeLevel: index,
        };
        currentLevel.push(existingNode);
      }

      currentLevel = existingNode.children;
    });
  });

  return root;
};
