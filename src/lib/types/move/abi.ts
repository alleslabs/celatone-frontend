import type { Nullable } from "../common";
import type { SnakeToCamelCaseNested } from "../converter";
import type { Pagination } from "../rest";

export enum UpgradePolicy {
  UNSPECIFIED = "UNSPECIFIED",
  COMPATIBLE = "COMPATIBLE",
  IMMUTABLE = "IMMUTABLE",
}

export type Visibility = "public" | "friend" | "private" | "script";

// TODO: revisit address type later
export interface ABIModule {
  address: string;
  name: string;
  functions: ABIFunction[];
}

// TODO: revisit moduleAddress type later
interface ABIFunction {
  method: "query" | "tx";
  moduleAddress: string;
  moduleName: string;
  functionName: string;
  typeArgsLength: number;
  argsTypes: string[];
}

/* response */
// TODO: change address type to HexAddr after figuring out how to correctly infer NominalType intersection
export interface ResponseModule {
  address: string;
  module_name: string;
  abi: string;
  raw_bytes: string;
  upgrade_policy: UpgradePolicy;
}

export interface ResponseModules {
  modules: ResponseModule[];
  pagination: Pagination;
}

// TODO: change address type to HexAddr after figuring out how to correctly infer NominalType intersection
export interface ResponseABI {
  address: string;
  name: string;
  friends: string[];
  exposed_functions: ExposedFunction[];
  structs: Struct[];
}

export type InternalModule = SnakeToCamelCaseNested<ResponseModule>;

export interface ExposedFunction {
  name: string;
  visibility: Visibility;
  is_view: boolean;
  is_entry: boolean;
  generic_type_params: GenericTypeParam[];
  params: string[];
  return: string[];
}

export interface Struct {
  name: string;
  is_native: boolean;
  abilities: string[];
  generic_type_params: GenericTypeParam[];
  fields: Field[];
}

export interface GenericTypeParam {
  constraints: string[];
}

interface Field {
  name: string;
  type: string;
}

export interface AbiFormData {
  typeArgs: Record<string, string>;
  args: Record<string, Nullable<string>>;
}
