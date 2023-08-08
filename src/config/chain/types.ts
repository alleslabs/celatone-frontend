import type { MainWalletBase } from "@cosmos-kit/core";

type FaucetConfig =
  | {
      enabled: true;
      url: string;
    }
  | { enabled: false };

type WasmConfig =
  | {
      enabled: true;
      storeCodeMaxFileSize: number;
      clearAdminGas: number;
    }
  | {
      enabled: false;
    };

type PoolConfig =
  | {
      enabled: true;
      url: string;
    }
  | { enabled: false };

type PublicProjectConfig = { enabled: boolean };

export interface ExplorerConfig {
  validator: string;
  proposal: string;
}

export interface ChainConfig {
  chain: string;
  registryChainName: string;
  prettyName: string;
  lcd: string;
  rpc: string;
  indexer: string;
  api: string;
  wallets: MainWalletBase[];
  features: {
    faucet: FaucetConfig;
    wasm: WasmConfig;
    pool: PoolConfig;
    publicProject: PublicProjectConfig;
  };
  gas: {
    gasPrice: {
      tokenPerGas: number;
      denom: string;
    };
    gasAdjustment: number;
    maxGasLimit: number;
  };
  explorerLink: ExplorerConfig;
  extra: {
    disableAnyOfAddresses?: boolean;
  };
}

export interface ChainConfigs {
  [chainId: string]: ChainConfig;
}
