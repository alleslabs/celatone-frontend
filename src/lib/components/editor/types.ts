import type { Option } from "lib/types";

export const EXTENSION_LIB = ["sol", "vy"];

export interface FilePath {
  code: string;
  path: string;
}

export interface SourceTreeNode extends FilePath {
  children: SourceTreeNode[];
  isFolder: boolean;
  isLib: boolean;
  isOpen: boolean;
  language: Option<string>;
  name: string;
  treeLevel: number;
}
