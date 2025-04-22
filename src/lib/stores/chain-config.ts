/* eslint-disable no-param-reassign */
import type { ChainConfig as SharedChainConfig } from "@alleslabs/shared";
import type { Option } from "lib/types";

import { find } from "lodash";
import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

type SharedChainConfigWithLcd = SharedChainConfig & { lcd: string };

export class LocalChainConfigStore {
  localChainConfigs: Record<
    string, // chainId
    SharedChainConfig
  >;

  get isHydrated(): boolean {
    const hydrated = isHydrated(this);

    // MARK: Support backward lcd to rest
    if (hydrated) {
      this.localChainConfigs = Object.entries(this.localChainConfigs).reduce<
        Record<string, SharedChainConfig>
      >((acc, [chainId, config]) => {
        const { lcd, rest, ...val } = config as SharedChainConfigWithLcd;
        if (lcd && rest === undefined) {
          acc[chainId] = { rest: lcd as string, ...val };
        } else {
          acc[chainId] = { rest, ...val };
        }
        return acc;
      }, {});
    }

    return hydrated;
  }

  constructor() {
    this.localChainConfigs = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "ChainConfigStore",
      properties: ["localChainConfigs"],
    });
  }

  addLocalChainConfig(chainId: string, chainConfig: SharedChainConfig) {
    if (this.isLocalChainIdExist(chainId)) {
      return;
    }

    this.updateLocalChainConfig(chainId, chainConfig);
  }

  getLocalChainConfig(chainId: string): Option<SharedChainConfig> {
    if (!this.isLocalChainIdExist(chainId)) {
      return undefined;
    }

    return this.localChainConfigs[chainId];
  }

  isLocalChainIdExist(chainId: string): boolean {
    return !!this.localChainConfigs[chainId];
  }

  isLocalPrettyNameExist(name: string): boolean {
    return !!find(this.localChainConfigs, { prettyName: name });
  }

  removeLocalChainConfig(chainId: string) {
    delete this.localChainConfigs[chainId];
  }

  updateLocalChainConfig(chainId: string, chainConfig: SharedChainConfig) {
    this.localChainConfigs[chainId] = chainConfig;
  }
}
