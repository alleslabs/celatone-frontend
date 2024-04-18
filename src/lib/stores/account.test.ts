import { zBechAddr } from "lib/types";

import { AccountStore } from "./account";

describe("accountStore", () => {
  let accountStore: AccountStore;
  const address = zBechAddr.parse("address");

  beforeEach(() => {
    accountStore = new AccountStore();
  });

  test("user key management", () => {
    expect(accountStore.isAccountUserKeyExist()).toBeFalsy();

    accountStore.setAccountUserKey("user-key");

    expect(accountStore.isAccountUserKeyExist()).toBeTruthy();
  });

  test("account info", () => {
    expect(accountStore.getAccountLocalInfo(address)).toBeUndefined();

    accountStore.updateAccountLocalInfo(address, "name", "description");

    expect(accountStore.getAccountLocalInfo(address)).toEqual({
      address: "address",
      name: "name",
      description: "description",
    });
  });

  test("saved account", () => {
    expect(accountStore.savedAccounts).toEqual({});
    expect(accountStore.isAccountSaved(address)).toBeFalsy();

    accountStore.updateAccountLocalInfo(address, "name", "description");

    expect(accountStore.isAccountSaved(address)).toBeTruthy();

    expect(accountStore.getSavedAccounts()).toEqual([
      {
        address: "address",
        name: "name",
        description: "description",
      },
    ]);
  });
});
