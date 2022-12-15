import { MsgType } from "lib/types";
import type { ChainGasPrice, Gas } from "lib/types";
import type { CelatoneConstants } from "types";

export const FALLBACK_GAS_REGISTRY: Record<string, ChainGasPrice> = {
  osmosistestnet: {
    denom: "uosmo",
    gasPrice: 0.025 as Gas<number>,
  },
  terra2: {
    denom: "uluna",
    gasPrice: 0.15 as Gas<number>,
  },
};

export const ENDPOINT_REGISTRY: Record<string, string> = {
  osmosis: "https://lcd.osmosis.zone",
  osmosistestnet: "https://lcd-test.osmosis.zone",
};

export const MAX_FILE_SIZE = 800_000;

export const DIRECTORY_DEFAULT = {
  instantiatedList: "Instantiated by me",
  savedList: "Saved Contracts",
  defaultAddress: "default-address",
};

export const MSG_TYPE_URL = {
  [MsgType.STORE_CODE]: "/cosmwasm.wasm.v1.MsgStoreCode",
  [MsgType.INSTANTIATE]: "/cosmwasm.wasm.v1.MsgInstantiateContract",
  [MsgType.EXECUTE]: "/cosmwasm.wasm.v1.MsgExecuteContract",
};

export const CELATONE_CONSTANTS: CelatoneConstants = {
  gasAdjustment: 1.6,
  fallbackGasRegistry: FALLBACK_GAS_REGISTRY,
  endpointRegistry: ENDPOINT_REGISTRY,
  maxFileSize: MAX_FILE_SIZE,
  directoryDefault: DIRECTORY_DEFAULT,
  msgTypeUrl: MSG_TYPE_URL,
};
