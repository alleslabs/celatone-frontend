import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

export class NetworkStore {
  private userKey: string;

  networks: Dict<string, string[]>;

  constructor() {
    this.userKey = "";
    this.networks = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "NetworkStore",
      properties: ["networks"],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  isNetworkUserKeyExist(): boolean {
    return !!this.userKey;
  }

  setNetworkUserKey(userKey: string) {
    this.userKey = userKey;
  }

  getPinnedNetworks(): string[] {
    return this.networks[this.userKey] ?? [];
  }

  isNetworkPinned(chainId: string): boolean {
    return this.getPinnedNetworks().findIndex((item) => item === chainId) > -1;
  }

  pinNetwork(chainId: string): void {
    if (!this.isNetworkPinned(chainId)) {
      this.networks[this.userKey] = [...this.getPinnedNetworks(), chainId];
    }
  }

  removeNetwork(chainId: string): void {
    this.networks[this.userKey] = this.getPinnedNetworks().filter(
      (item) => item !== chainId
    );
  }

  setPinnedNetworks(chainIds: string[]): void {
    this.networks[this.userKey] = chainIds;
  }
}
