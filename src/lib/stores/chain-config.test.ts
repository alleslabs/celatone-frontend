import type { ChainConfig } from "@alleslabs/shared";

import { LocalChainConfigStore } from "./chain-config";

const MOCK_CONFIG: ChainConfig = {
  tier: "sequencer",
  chainId: "test-1",
  chain: "test",
  registryChainName: "testonly",
  prettyName: "Test Only",
  rpc: "https://rpc.testonly.com",
  lcd: "https://rpc.testonly.com",
  wallets: ["keplr", "initia", "compass", "station"],
  features: {
    faucet: { enabled: false },
    wasm: { enabled: false },
    move: { enabled: false },
    evm: { enabled: false },
    pool: { enabled: false },
    gov: { enabled: false },
    nft: { enabled: false },
    publicProject: { enabled: false },
  },
  gas: {
    gasAdjustment: 1.5,
    maxGasLimit: 100,
  },
  extra: {},
  network_type: "local",
  fees: {
    fee_tokens: [
      {
        denom: "utest",
        fixed_min_gas_price: 0.002,
        low_gas_price: 0.001,
      },
    ],
  },
  registry: {
    bech32_prefix: "test",
    slip44: 118,
    staking: {
      staking_tokens: [],
    },
    assets: [],
  },
};

describe("chain config management", () => {
  let chainConfigStore: LocalChainConfigStore;
  beforeEach(() => {
    chainConfigStore = new LocalChainConfigStore();
  });

  test("get chain config", () => {
    chainConfigStore.addLocalChainConfig("test-1", MOCK_CONFIG);
    const chainConfig = chainConfigStore.getLocalChainConfig("test-1");
    expect(chainConfig).toEqual(MOCK_CONFIG);
  });

  test("save chain config", () => {
    chainConfigStore.addLocalChainConfig("test-1", MOCK_CONFIG);
    const chainConfig = chainConfigStore.getLocalChainConfig("test-1");
    expect(chainConfig).toEqual(MOCK_CONFIG);
    expect(chainConfigStore.isLocalChainIdExist("test-1")).toBeTruthy();
  });

  test("update chain config", () => {
    const newChainConfig = {
      ...MOCK_CONFIG,
      rpc: "https://rpc.test.com",
    };
    chainConfigStore.updateLocalChainConfig("test-1", newChainConfig);
    expect(chainConfigStore.getLocalChainConfig("test-1")).not.toEqual(
      MOCK_CONFIG
    );
    expect(chainConfigStore.getLocalChainConfig("test-1")).toEqual(
      newChainConfig
    );
  });

  test("delete chain config", () => {
    chainConfigStore.updateLocalChainConfig("test-1", MOCK_CONFIG);
    chainConfigStore.removeLocalChainConfig("test-1");
    expect(chainConfigStore.localChainConfigs).toEqual({});
  });
});
