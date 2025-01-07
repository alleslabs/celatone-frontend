import type { HexAddr } from "../addrs";
import type { SnakeToCamelCaseNested } from "../converter";

export type InternalResource = SnakeToCamelCaseNested<ResponseResource>;

export interface ResourceGroup {
  account: HexAddr;
  displayName: string;
  group: string;
  items: InternalResource[];
}

export interface ResourceGroupByAccount {
  owner: HexAddr;
  resources: ResourceGroup[];
}

export interface ResponseResource {
  address: string;
  move_resource: string;
  raw_bytes: string;
  struct_tag: string;
}
