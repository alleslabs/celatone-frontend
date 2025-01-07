import type {
  BechAddr,
  ExposedFunction,
  HexAddr,
  IndexedModule,
} from "lib/types";

export type DisplayMode = "display" | "input";

export type ModuleSelectFunction = (
  selectedModule: IndexedModule,
  fn?: ExposedFunction
) => void;

export interface SelectedAddress {
  address: BechAddr;
  hex: HexAddr;
}
