import type { BechAddr, Dict } from "lib/types";

import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

export interface AccountLocalInfo {
  address: BechAddr;
  name?: string;
  description?: string;
}
export class AccountStore {
  private userKey: string;

  savedAccounts: Dict<string, BechAddr[]>;

  accountLocalInfo: Dict<
    string, // user key
    Record<string, AccountLocalInfo>
  >;

  constructor() {
    this.savedAccounts = {};
    this.accountLocalInfo = {};
    this.userKey = "";

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "AccountStore",
      properties: ["savedAccounts", "accountLocalInfo"],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  isAccountUserKeyExist(): boolean {
    return !!this.userKey;
  }

  setAccountUserKey(userKey: string) {
    this.userKey = userKey;
  }

  getAccountLocalInfo(address: BechAddr): AccountLocalInfo | undefined {
    return this.accountLocalInfo[this.userKey]?.[address];
  }

  updateAccountLocalInfo(
    address: BechAddr,
    name?: string,
    description?: string
  ) {
    const savedAccounts = this.savedAccounts[this.userKey];
    if (!savedAccounts) this.savedAccounts[this.userKey] = [address];
    else if (!savedAccounts.includes(address)) savedAccounts.push(address);

    const accountLocalInfo = this.accountLocalInfo[this.userKey]?.[address] ?? {
      address,
      description,
      name,
    };

    if (name !== undefined)
      accountLocalInfo.name = name.trim().length ? name.trim() : undefined;

    if (description !== undefined)
      accountLocalInfo.description = description.trim().length
        ? description.trim()
        : undefined;

    this.accountLocalInfo[this.userKey] = {
      ...this.accountLocalInfo[this.userKey],
      [address]: accountLocalInfo,
    };
  }

  isAccountSaved(address: BechAddr): boolean {
    return this.savedAccounts[this.userKey]?.includes(address) ?? false;
  }

  removeSavedAccount(address: BechAddr): void {
    this.savedAccounts[this.userKey] = this.savedAccounts[this.userKey]?.filter(
      (each) => each !== address
    );
    delete this.accountLocalInfo[this.userKey]?.[address];
  }

  getSavedAccounts(): AccountLocalInfo[] {
    const savedAccountsByUserKey = this.savedAccounts[this.userKey] ?? [];
    return savedAccountsByUserKey
      .map((address) => ({
        address,
        description: this.getAccountLocalInfo(address)?.description,
        name: this.getAccountLocalInfo(address)?.name,
      }))
      .reverse();
  }
}
