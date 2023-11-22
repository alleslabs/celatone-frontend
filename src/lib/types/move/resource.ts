import type { MoveAccountAddr } from "../addrs";
import type { SnakeToCamelCaseNested } from "../converter";
import type { Pagination } from "../rest";

export interface ResponseResource {
  address: string;
  move_resource: string;
  raw_bytes: string;
  struct_tag: string;
}

export interface ResponseResources {
  resources: ResponseResource[];
  pagination: Pagination;
}

export type InternalResource = SnakeToCamelCaseNested<ResponseResource>;

export interface ResourceGroup {
  group: string;
  account: MoveAccountAddr;
  displayName: string;
  items: InternalResource[];
}

export interface ResourceGroupByAccount {
  owner: MoveAccountAddr;
  resources: Record<string, ResourceGroup>;
}
