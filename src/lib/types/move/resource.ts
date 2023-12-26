import type { MoveAccountAddr } from "../addrs";
import type { SnakeToCamelCaseNested } from "../converter";

export interface ResponseResource {
  address: string;
  move_resource: string;
  raw_bytes: string;
  struct_tag: string;
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
  resources: ResourceGroup[];
}
