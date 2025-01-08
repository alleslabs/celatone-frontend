import type { HexAddr } from "../addrs";
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
  account: HexAddr;
  displayName: string;
  items: InternalResource[];
}

export interface ResourceGroupByAccount {
  owner: HexAddr;
  resources: ResourceGroup[];
}
