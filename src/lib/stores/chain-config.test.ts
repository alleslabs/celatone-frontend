import type { ChainConfig } from "@alleslabs/shared";

import { ChainConfigStore } from "./chain-config";

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
  let chainConfigStore: ChainConfigStore;
  beforeEach(() => {
    chainConfigStore = new ChainConfigStore();
  });

  test("get chain config", () => {
    chainConfigStore.addChainConfig("test-1", MOCK_CONFIG);
    const chainConfig = chainConfigStore.getChainConfig("test-1");
    expect(chainConfig).toEqual(MOCK_CONFIG);
  });

  test("save chain config", () => {
    chainConfigStore.addChainConfig("test-1", MOCK_CONFIG);
    const chainConfig = chainConfigStore.getChainConfig("test-1");
    expect(chainConfig).toEqual(MOCK_CONFIG);
    expect(chainConfigStore.isChainIdExist("test-1")).toBeTruthy();
  });

  test("update chain config", () => {
    const newChainConfig = {
      ...MOCK_CONFIG,
      rpc: "https://rpc.test.com",
    };
    chainConfigStore.updateChainConfig("test-1", newChainConfig);
    expect(chainConfigStore.getChainConfig("test-1")).not.toEqual(MOCK_CONFIG);
    expect(chainConfigStore.getChainConfig("test-1")).toEqual(newChainConfig);
  });

  test("delete chain config", () => {
    chainConfigStore.updateChainConfig("test-1", MOCK_CONFIG);
    chainConfigStore.removeChainConfig("test-1");
    expect(chainConfigStore.chainConfigs).toEqual({});
  });
});
