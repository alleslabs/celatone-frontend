import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Addr, Dict } from "lib/types";

export interface AccountLocalInfo {
  address: Addr;
  name?: string;
  description?: string;
}
export class AccountStore {
  private userKey: string;

  savedAccounts: Dict<string, Addr[]>;

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

  getAccountLocalInfo(address: Addr): AccountLocalInfo | undefined {
    return this.accountLocalInfo[this.userKey]?.[address];
  }

  updateAccountLocalInfo(
    userKey: string,
    address: Addr,
    name?: string,
    description?: string
  ) {
    const savedAccounts = this.savedAccounts[this.userKey];
    if (!savedAccounts) this.savedAccounts[this.userKey] = [address];
    else if (!savedAccounts.includes(address)) savedAccounts.push(address);

    const accountLocalInfo = this.accountLocalInfo[userKey]?.[address] ?? {
      address,
      name,
      description,
    };

    if (name !== undefined)
      accountLocalInfo.name = name.trim().length ? name.trim() : undefined;

    if (description !== undefined)
      accountLocalInfo.description = description.trim().length
        ? description.trim()
        : undefined;

    this.accountLocalInfo[userKey] = {
      ...this.accountLocalInfo[userKey],
      [address]: accountLocalInfo,
    };
  }

  isAccountSaved(address: Addr): boolean {
    return this.savedAccounts[this.userKey]?.includes(address) ?? false;
  }

  getSavedAccounts(): AccountLocalInfo[] {
    const savedAccountsByUserKey = this.savedAccounts[this.userKey] ?? [];
    return savedAccountsByUserKey
      .map((address) => ({
        address,
        name: this.getAccountLocalInfo(address)?.name,
        description: this.getAccountLocalInfo(address)?.description,
      }))
      .reverse();
  }
}
