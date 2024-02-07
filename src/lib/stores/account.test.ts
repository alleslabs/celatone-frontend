import { zBechAddr } from "lib/types";

import { AccountStore } from "./account";

describe("accountStore", () => {
  let accountStore: AccountStore;

  beforeEach(() => {
    accountStore = new AccountStore();
  });

  test("user key management", () => {
    expect(accountStore.isAccountUserKeyExist()).toBeFalsy();

    accountStore.setAccountUserKey("user-key");

    expect(accountStore.isAccountUserKeyExist()).toBeTruthy();
  });

  test("account info", () => {
    expect(
      accountStore.getAccountLocalInfo(zBechAddr.parse("address"))
    ).toBeUndefined();

    accountStore.updateAccountLocalInfo(
      zBechAddr.parse("address"),
      "name",
      "description"
    );

    expect(
      accountStore.getAccountLocalInfo(zBechAddr.parse("address"))
    ).toEqual({
      address: zBechAddr.parse("address"),
      name: "name",
      description: "description",
    });
  });

  test("saved account", () => {
    expect(accountStore.savedAccounts).toEqual({});
    expect(accountStore.isAccountSaved(zBechAddr.parse("address"))).toBeFalsy();

    accountStore.updateAccountLocalInfo(
      zBechAddr.parse("address"),
      "name",
      "description"
    );

    expect(
      accountStore.isAccountSaved(zBechAddr.parse("address"))
    ).toBeTruthy();

    expect(accountStore.getSavedAccounts()).toEqual([
      {
        address: zBechAddr.parse("address"),
        name: "name",
        description: "description",
      },
    ]);
  });
});
