import type { HexAddr } from "../addrs";
import type { Nullable } from "../common";

export interface AbiFormData {
  args: Record<string, Nullable<string>>;
  typeArgs: Record<string, string>;
}

export interface ExposedFunction {
  generic_type_params: GenericTypeParam[];
  is_entry: boolean;
  is_view: boolean;
  name: string;
  params: string[];
  return: string[];
  visibility: Visibility;
}

export interface GenericTypeParam {
  constraints: string[];
}

export interface ModuleAbi {
  address: HexAddr;
  exposed_functions: ExposedFunction[];
  friends: string[];
  name: string;
  structs: Struct[];
}

export interface Struct {
  abilities: string[];
  fields: Field[];
  generic_type_params: GenericTypeParam[];
  is_native: boolean;
  name: string;
}

export type Visibility = "friend" | "private" | "public" | "script";

interface Field {
  name: string;
  type: string;
}
