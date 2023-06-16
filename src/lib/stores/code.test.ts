import type { Addr } from "lib/types";

import { CodeStore } from "./code";

const TEST_USER_KEY = "test-default-address";

const initCodeStore = () => {
  const codeStore = new CodeStore();
  codeStore.setCodeUserKey(TEST_USER_KEY);
  return codeStore;
};

describe("CodeStore", () => {
  test("setting userkey", () => {
    const codeStore = new CodeStore();
    expect(codeStore.isCodeUserKeyExist()).toBeFalsy();
    codeStore.setCodeUserKey(TEST_USER_KEY);
    expect(codeStore.isCodeUserKeyExist()).toBeTruthy();
  });

  test("code local info", () => {
    const codeStore = initCodeStore();
    expect(codeStore.getCodeLocalInfo(1)).toBeUndefined();

    codeStore.updateCodeInfo(
      1,
      "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly" as Addr,
      "code-name"
    );
    expect(codeStore.getCodeLocalInfo(1)).toStrictEqual({
      id: 1,
      name: "code-name",
      uploader: "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly",
    });

    expect(codeStore.lastSavedCodes(TEST_USER_KEY)).toStrictEqual([]);
    codeStore.saveNewCode(1);
    expect(codeStore.lastSavedCodes(TEST_USER_KEY)).toStrictEqual([
      {
        id: 1,
        name: "code-name",
        uploader: "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly",
      },
    ]);
  });

  test("save codes", () => {
    const codeStore = initCodeStore();
    expect(codeStore.isCodeIdSaved(1)).toBeFalsy();
    expect(codeStore.lastSavedCodeIds(TEST_USER_KEY)).toStrictEqual([]);

    codeStore.saveNewCode(2);
    codeStore.saveNewCode(1);
    codeStore.saveNewCode(3);
    expect(codeStore.lastSavedCodeIds(TEST_USER_KEY)).toStrictEqual([3, 1, 2]);

    codeStore.removeSavedCode(4);
    codeStore.removeSavedCode(1);
    expect(codeStore.lastSavedCodeIds(TEST_USER_KEY)).toStrictEqual([3, 2]);
  });
});
