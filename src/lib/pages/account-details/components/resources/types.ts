import type { InternalResource } from "lib/types";

export interface ResourceGroup {
  group: string;
  account: string;
  displayName: string;
  items: InternalResource[];
}

export interface ResourceGroupByAccount {
  owner: string;
  resources: Record<string, ResourceGroup>;
}
