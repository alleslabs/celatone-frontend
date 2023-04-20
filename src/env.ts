import type { SupportedChain } from "lib/data";
import type {
  ContractAddr,
  ChainGasPrice,
  Token,
  U,
  HumanAddr,
} from "lib/types";
import type {
  CelatoneConstants,
  CelatoneContractAddress,
  CelatoneHumanAddress,
} from "types";

export const CELATONE_FALLBACK_GAS_PRICE: Record<string, ChainGasPrice> = {
  osmosistestnet: {
    denom: "uosmo",
    gasPrice: "0.025" as U<Token>,
  },
  terra2: {
    denom: "uluna",
    gasPrice: "0.015" as U<Token>,
  },
  terra2testnet: {
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
    case "terra2":
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

export const CELATONE_APP_HUMAN_ADDRESS = (
  chainName: string
): CelatoneHumanAddress => {
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      return {
        example: "osmo14wk9zecqam9jsac7xwtf8e349ckquzzlx9k8c3" as HumanAddr,
      };
    case "terra2":
    case "terra2testnet":
      return {
        example: "terra1dtdqq3sn8c6y6sjvtf4340aycv2g6x6pp5tkln" as HumanAddr,
      };
    default:
      return {
        example: "" as HumanAddr,
      };
  }
};

export const FALLBACK_LCD_ENDPOINT: Record<string, string> = {
  osmosis: "https://lcd.osmosis.zone/",
  osmosistestnet: "https://lcd-test.osmosis.zone/",
  terra2: "https://phoenix-lcd.terra.dev/",
  terra2testnet: "https://pisco-lcd.terra.dev/",
};

export const MAX_FILE_SIZE = 800_000;

export const CELATONE_CONSTANTS: CelatoneConstants = {
  gasAdjustment: 1.6,
  maxFileSize: MAX_FILE_SIZE,
};

export const DUMMY_MNEMONIC = process.env.NEXT_PUBLIC_DUMMY_MNEMONIC;

export const SELECTED_CHAIN = process.env
  .NEXT_PUBLIC_SELECTED_CHAIN as SupportedChain;

export const CELATONE_API_ENDPOINT = "https://celatone-api.alleslabs.dev";

export const getChainApiPath = (chainName: string) => {
  switch (chainName) {
    case "osmosistestnet":
    case "osmosis":
      return "osmosis";
    case "terra2":
    case "terra2testnet":
      return "terra";
    default:
      return undefined;
  }
};
// TODO to handle testnet separately later
export const getMainnetApiPath = (chainId: string) => {
  switch (chainId) {
    case "osmo-test-4":
    case "osmosis-1":
      return "osmosis-1";
    case "pisco-1":
    case "phoenix-1":
      return "phoenix-1";
    default:
      return undefined;
  }
};
