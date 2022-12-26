import { MsgType } from "lib/types";
import type { ContractAddr, ChainGasPrice, Token, U } from "lib/types";
import type { CelatoneConstants, CelatoneContractAddress } from "types";

export const CELATONE_FALLBACK_GAS_PRICE: Record<string, ChainGasPrice> = {
  osmosistestnet: {
    denom: "uosmo",
    gasPrice: "0.025" as U<Token>,
  },
  terra2: {
    denom: "uluna",
    gasPrice: "0.15" as U<Token>,
  },
};

export const CELATONE_APP_CONTRACT_ADDRESS = (
  chainName: string
): CelatoneContractAddress => {
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      return {
        example:
          "osmo1p0pxllmqjgl2tefy7grypt34jdpdltg3ka98n8unnl322wqps7lqtu576h" as ContractAddr,
      };
    case "terra2testnet":
      return {
        example:
          "terra1k5arpcpusfrtnucr5q8f5uh5twghh3q360hv4j6fe0hvzn7x8skqempu76" as ContractAddr,
      };
    default:
      return {
        example: "" as ContractAddr,
      };
  }
};

export const LCD_ENDPOINT: Record<string, string> = {
  osmosis: "https://lcd.osmosis.zone",
  osmosistestnet: "https://lcd-test.osmosis.zone",
};

export const MAX_FILE_SIZE = 800_000;

export const MSG_TYPE_URL = {
  [MsgType.STORE_CODE]: "/cosmwasm.wasm.v1.MsgStoreCode",
  [MsgType.INSTANTIATE]: "/cosmwasm.wasm.v1.MsgInstantiateContract",
  [MsgType.EXECUTE]: "/cosmwasm.wasm.v1.MsgExecuteContract",
};

export const CELATONE_CONSTANTS: CelatoneConstants = {
  gasAdjustment: 1.6,
  lcdEndpoint: LCD_ENDPOINT,
  maxFileSize: MAX_FILE_SIZE,
  msgTypeUrl: MSG_TYPE_URL,
};

export const DUMMY_MNEMONIC = process.env.NEXT_PUBLIC_DUMMY_MNEMONIC;
