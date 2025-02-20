import type { HexAddr20 } from "lib/types";

export enum ProxyType {
  Eip1167 = "Eip1167",
  Eip1967Direct = "Eip1967Direct",
  Eip1967Beacon = "Eip1967Beacon",
  Eip1822 = "Eip1822",
  Eip897 = "Eip897",
  OpenZeppelin = "OpenZeppelin",
  Safe = "Safe",
  Comptroller = "Comptroller",
}

export interface ProxyResult {
  target: HexAddr20;
  type: ProxyType;
  immutable: boolean;
}
