import type { HexAddr20 } from "lib/types";

export enum ProxyType {
  Comptroller = "Comptroller",
  Eip897 = "Eip897",
  Eip1167 = "Eip1167",
  Eip1822 = "Eip1822",
  Eip1967Beacon = "Eip1967Beacon",
  Eip1967Direct = "Eip1967Direct",
  OpenZeppelin = "OpenZeppelin",
  Safe = "Safe",
}

export interface ProxyResult {
  immutable: boolean;
  target: HexAddr20;
  type: ProxyType;
}
