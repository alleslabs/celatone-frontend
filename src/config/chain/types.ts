import type { MainWalletBase } from "@cosmos-kit/core";

import type { Nullable } from "lib/types";

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

type MoveConfig =
  | {
      enabled: true;
      moduleMaxFileSize: number;
      decodeApi: string;
      verify: string;
    }
  | { enabled: false };

type PoolConfig =
  | {
      enabled: true;
      url: string;
    }
  | { enabled: false };

type PublicProjectConfig = { enabled: boolean };

type GovConfig =
  | {
      enabled: true;
      version: "v1beta1" | "v1";
      hideOpenProposal?: boolean;
      disableWhitelistProposal?: boolean;
      disableStoreCodeProposal?: boolean;
    }
  | {
      enabled: false;
    };

type NftConfig = { enabled: boolean };

export interface ChainConfig {
  tier: "lite" | "full";
  chain: string;
  registryChainName: string;
  prettyName: string;
  logoUrl?: string;
  networkType: "mainnet" | "testnet";
  lcd: string;
  rpc: string;
  indexer: string;
  wallets: MainWalletBase[];
  features: {
    faucet: FaucetConfig;
    wasm: WasmConfig;
    move: MoveConfig;
    pool: PoolConfig;
    publicProject: PublicProjectConfig;
    gov: GovConfig;
    nft: NftConfig;
  };
  gas: {
    gasPrice: {
      tokenPerGas: number;
      denom: string;
    };
    gasAdjustment: number;
    maxGasLimit: number;
  };
  extra: {
    disableAnyOfAddresses?: boolean;
    isValidatorExternalLink?: Nullable<string>;
  };
}

export interface ChainConfigs {
  [chainId: string]: ChainConfig;
}
