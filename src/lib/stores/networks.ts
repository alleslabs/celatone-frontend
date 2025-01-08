import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

export class NetworkStore {
  pinnedNetworks: string[];

  constructor() {
    this.pinnedNetworks = [];

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "NetworkStore",
      properties: ["pinnedNetworks"],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  getPinnedNetworks(): string[] {
    return this.pinnedNetworks ?? [];
  }

  isNetworkPinned(chainId: string): boolean {
    return this.getPinnedNetworks().findIndex((item) => item === chainId) > -1;
  }

  pinNetwork(chainId: string): void {
    if (!this.isNetworkPinned(chainId)) {
      this.pinnedNetworks = [...this.getPinnedNetworks(), chainId];
    }
  }

  removeNetwork(chainId: string): void {
    this.pinnedNetworks = this.getPinnedNetworks().filter(
      (item) => item !== chainId
    );
  }

  setPinnedNetworks(chainIds: string[]): void {
    this.pinnedNetworks = chainIds;
  }
}
