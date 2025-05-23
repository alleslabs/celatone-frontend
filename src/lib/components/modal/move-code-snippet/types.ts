import type { AbiFormData, ExposedFunction, HexAddr } from "lib/types";

export interface CodeSnippetBaseProps {
  abiData: AbiFormData;
  fn: ExposedFunction;
  moduleAddress: HexAddr;
  moduleName: string;
}
