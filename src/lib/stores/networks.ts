import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

export interface Network {
  name: string;
  chainId: string;
  logo: string;
}

export class NetworkStore {
  private userKey: string;

  networks: Dict<string, Network[]>;

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

  getPinnedNetworks(): Network[] {
    return this.networks[this.userKey] ?? [];
  }

  isNetworkPinned(chainId: string): boolean {
    const networkByUserKey = this.getPinnedNetworks();

    return networkByUserKey.findIndex((x) => x.chainId === chainId) > -1;
  }

  pinNetwork(newNetwork: Network): void {
    if (!this.isNetworkPinned(newNetwork.chainId)) {
      this.networks[this.userKey] = [...this.getPinnedNetworks(), newNetwork];
    }
  }

  removeNetwork(chainId: string): void {
    this.networks[this.userKey] = this.networks[this.userKey]?.filter(
      (each) => each.chainId !== chainId
    );
  }
}
