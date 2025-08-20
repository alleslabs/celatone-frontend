import type { ChainConfig } from "@alleslabs/shared";

import { LocalChainConfigStore } from "./chain-config";

const MOCK_CONFIG: ChainConfig = {
  chain: "test",
  chainId: "test-1",
  extra: {},
  features: {
    evm: { enabled: false },
    gov: { enabled: false },
    move: { enabled: false },
    nft: { enabled: false },
    pool: { enabled: false },
    publicProject: { enabled: false },
    wasm: { enabled: false },
  },
  fees: {
    fee_tokens: [
      {
        denom: "utest",
        fixed_min_gas_price: 0.002,
        low_gas_price: 0.001,
      },
    ],
  },
  gas: {
    gasAdjustment: 1.5,
    maxGasLimit: 100,
  },
  indexer: "https://indexer.testonly.com",
  network_type: "local",
  prettyName: "Test Only",
  registry: {
    assets: [],
    bech32_prefix: "test",
    slip44: 118,
    staking: {
      staking_tokens: [],
    },
  },
  registryChainName: "testonly",
  rest: "https://rpc.testonly.com",
  rpc: "https://rpc.testonly.com",
  tier: "sequencer",
  wallets: ["keplr", "compass", "station"],
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
