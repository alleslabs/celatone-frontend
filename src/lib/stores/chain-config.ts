import type { ChainConfig as SharedChainConfig } from "@alleslabs/shared";
import { find } from "lodash";
import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Option } from "lib/types";

export class ChainConfigStore {
  chainConfigs: Record<
    string, // chainId
    SharedChainConfig
  >;

  constructor() {
    this.chainConfigs = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "ChainConfigStore",
      properties: ["chainConfigs"],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  getChainConfig(chainId: string): Option<SharedChainConfig> {
    if (!this.isChainIdExist(chainId)) {
      return undefined;
    }

    return this.chainConfigs[chainId];
  }

  updateChainConfig(chainId: string, chainConfig: SharedChainConfig) {
    this.chainConfigs[chainId] = chainConfig;
  }

  addChainConfig(chainId: string, chainConfig: SharedChainConfig) {
    if (this.isChainIdExist(chainId)) {
      return;
    }

    this.updateChainConfig(chainId, chainConfig);
  }

  removeChainConfig(chainId: string) {
    delete this.chainConfigs[chainId];
  }

  isChainIdExist(chainId: string): boolean {
    return !!this.chainConfigs[chainId];
  }

  isPrettyNameExist(name: string): boolean {
    return !!find(this.chainConfigs, { prettyName: name });
  }
}
