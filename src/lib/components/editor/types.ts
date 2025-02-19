import { Option } from "lib/types";

export const EXTENSION_LIB = ["sol", "vy"];

export interface FilePath {
  path: string;
  code: string;
}

export interface SourceTreeNode extends FilePath {
  name: string;
  isOpen: boolean;
  isFolder: boolean;
  isLib: boolean;
  treeLevel: number;
  children: SourceTreeNode[];
  language: Option<string>;
}
