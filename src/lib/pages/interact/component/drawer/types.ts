import type { IndexedModule } from "lib/services/move/moduleService";
import type { BechAddr, ExposedFunction, HexAddr } from "lib/types";

export interface SelectedAddress {
  address: BechAddr;
  hex: HexAddr;
}

export type DisplayMode = "input" | "display";

export type ModuleSelectFunction = (
  selectedModule: IndexedModule,
  fn?: ExposedFunction
) => void;
