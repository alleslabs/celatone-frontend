import type { IndexedModule } from "lib/services/moduleService";
import type { HumanAddr, HexAddr, ExposedFunction } from "lib/types";

export interface SelectedAddress {
  address: HumanAddr;
  hex: HexAddr;
}

export type DisplayMode = "input" | "display";

export type ModuleSelectFunction = (
  selectedModule: IndexedModule,
  fn?: ExposedFunction
) => void;
