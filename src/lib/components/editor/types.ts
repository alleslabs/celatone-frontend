export const EXTENSION_LIB = ["sol"];

export interface FilePath {
  path: string;
  code: string;
}

export interface SourceTreeNode extends FilePath {
  name: string;
  isOpen: boolean;
  isFolder: boolean;
  treeLevel: number;
  children: SourceTreeNode[];
}
