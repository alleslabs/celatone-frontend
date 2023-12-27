import {
  createWasmAminoConverters,
  type SigningCosmWasmClientOptions,
} from "@cosmjs/cosmwasm-stargate";
import { wasmTypes } from "@cosmjs/cosmwasm-stargate/build/modules";
import { Registry } from "@cosmjs/proto-signing";
import {
  AminoTypes,
  createDefaultAminoConverters,
  defaultRegistryTypes as defaultStargateTypes,
} from "@cosmjs/stargate";

import { createMoveAminoConverters, moveTypes } from "./move";

/**
 * Remark: This is the custom signerOptions for the SigningCosmWasmClient.
 */
export const getCustomedSigningCosmwasm = (): SigningCosmWasmClientOptions => {
  const registry = [...defaultStargateTypes, ...wasmTypes, ...moveTypes];
  const aminoTypes = {
    ...createDefaultAminoConverters(),
    ...createWasmAminoConverters(),
    ...createMoveAminoConverters(),
  };

  return {
    registry: new Registry(registry),
    aminoTypes: new AminoTypes(aminoTypes),
  };
};
