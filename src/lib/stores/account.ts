import type { HumanAddr } from "lib/types";

export interface AccountLocalInfo {
  address: HumanAddr;
  name: string;
  description?: string;
}
