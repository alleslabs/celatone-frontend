import type { HumanAddr, ValidatorAddr, ContractAddr } from "lib/types";

type FaucetConfig =
  | {
      enabled: true;
      url: string;
      denom: string;
      amount: number;
    }
  | { enabled: false };

type WasmConfig =
  | {
      enabled: true;
      storeCodeMaxFileSize: number;
    }
  | {
      enabled: false;
    };

type PoolConfig =
  | {
      enabled: true;
    }
  | {
      enabled: false;
    };

export interface ChainConfig {
  chain: string;
  registryChainName: string;
  lcd: string;
  rpc: string;
  indexer: string;
  api: string;
  features: {
    faucet: FaucetConfig;
    wasm: WasmConfig;
    pool: PoolConfig;
  };
  gas: {
    gasPrice: {
      tokenPerGas: number;
      denom: string;
    };
    gasAdjustment: number;
  };
  exampleAddresses: {
    user: HumanAddr;
    validator: ValidatorAddr;
    contract: ContractAddr;
  };
  explorerLink: {
    validator: string;
    proposal: string;
  };
}

export interface ChainConfigs {
  [chainId: string]: ChainConfig;
}

export interface ProjectConstants {
  // wasm
  maxListNameLength: number;
  maxContractNameLength: number;
  maxContractDescriptionLength: number;
  maxCodeNameLength: number;

  // proposal
  maxProposalTitleLength: number;
}
