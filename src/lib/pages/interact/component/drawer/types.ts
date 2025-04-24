import type {
  BechAddr,
  ExposedFunction,
  HexAddr,
  IndexedModule,
} from "lib/types";

export interface SelectedAddress {
  address: BechAddr;
  hex: HexAddr;
}

export type DisplayMode = "display" | "input";

export type ModuleSelectFunction = (
  selectedModule: IndexedModule,
  fn?: ExposedFunction
) => void;
