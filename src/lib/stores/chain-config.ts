import type { ChainConfig as SharedChainConfig } from "@alleslabs/shared";
import { find } from "lodash";
import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Option } from "lib/types";

export class LocalChainConfigStore {
  localChainConfigs: Record<
    string, // chainId
    SharedChainConfig
  >;

  constructor() {
    this.localChainConfigs = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "ChainConfigStore",
      properties: ["localChainConfigs"],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  getLocalChainConfig(chainId: string): Option<SharedChainConfig> {
    if (!this.isLocalChainIdExist(chainId)) {
      return undefined;
    }

    return this.localChainConfigs[chainId];
  }

  updateLocalChainConfig(chainId: string, chainConfig: SharedChainConfig) {
    this.localChainConfigs[chainId] = chainConfig;
  }

  addLocalChainConfig(chainId: string, chainConfig: SharedChainConfig) {
    if (this.isLocalChainIdExist(chainId)) {
      return;
    }

    this.updateLocalChainConfig(chainId, chainConfig);
  }

  removeLocalChainConfig(chainId: string) {
    delete this.localChainConfigs[chainId];
  }

  isLocalChainIdExist(chainId: string): boolean {
    return !!this.localChainConfigs[chainId];
  }

  isLocalPrettyNameExist(name: string): boolean {
    return !!find(this.localChainConfigs, { prettyName: name });
  }
}
