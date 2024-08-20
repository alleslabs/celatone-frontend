import type { BechAddr20 } from "lib/types";

import { CodeStore } from "./code";

const TEST_USER_KEY = "test-default-address";
const EMPTY_USER_KEY = "empty-default-address";

test("CodeStore setting userkey", () => {
  const codeStore = new CodeStore();
  expect(codeStore.isCodeUserKeyExist()).toBeFalsy();
  codeStore.setCodeUserKey(TEST_USER_KEY);
  expect(codeStore.isCodeUserKeyExist()).toBeTruthy();
});

describe("CodeStore", () => {
  let codeStore: CodeStore;
  const initCodeStore = () => {
    codeStore = new CodeStore();
    codeStore.setCodeUserKey(TEST_USER_KEY);
  };

  describe("code local info", () => {
    test("after initialization nothing in the store", () => {
      initCodeStore();

      expect(codeStore.getCodeLocalInfo(1)).toBeUndefined();
      // Do nothing as no code is saved
      codeStore.removeSavedCode(1);
    });

    test("add info for code 1 with no code name", () => {
      codeStore.updateCodeInfo(
        1,
        "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly" as BechAddr20
      );
      expect(codeStore.getCodeLocalInfo(1)).toStrictEqual({
        id: 1,
        uploader: "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly",
      });
    });

    test("update name for code 1", () => {
      codeStore.updateCodeInfo(
        1,
        "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly" as BechAddr20,
        "code-name"
      );
      expect(codeStore.getCodeLocalInfo(1)).toStrictEqual({
        id: 1,
        name: "code-name",
        uploader: "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly",
      });
    });

    test("add code 1 to the saved codes list", () => {
      expect(codeStore.lastSavedCodes()).toStrictEqual([]);
      codeStore.saveNewCode(1);
      expect(codeStore.lastSavedCodes()).toStrictEqual([
        {
          id: 1,
          name: "code-name",
          uploader: "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly",
        },
      ]);
      // There should be no update to another user's last saved codes list
      codeStore.setCodeUserKey(EMPTY_USER_KEY);
      expect(codeStore.lastSavedCodes()).toStrictEqual([]);
      codeStore.setCodeUserKey(TEST_USER_KEY);
    });

    test("add code 2 (with no info) to the saved codes list", () => {
      // validate code 2 is never saved and have no info
      expect(codeStore.isCodeIdSaved(2)).toBeFalsy();
      expect(codeStore.getCodeLocalInfo(2)).toBeUndefined();

      codeStore.saveNewCode(2);
      expect(codeStore.lastSavedCodes()).toStrictEqual([
        {
          id: 2,
          name: undefined,
          uploader: "N/A",
        },
        {
          id: 1,
          name: "code-name",
          uploader: "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly",
        },
      ]);
    });

    test("update info for code 2", () => {
      codeStore.updateCodeInfo(
        2,
        "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly" as BechAddr20,
        ""
      );
      expect(codeStore.lastSavedCodes()).toStrictEqual([
        {
          id: 2,
          name: undefined,
          uploader: "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly",
        },
        {
          id: 1,
          name: "code-name",
          uploader: "celat1r02tlyyaqs6tmrfa4jf37t7ewuxr57qp8ghzly",
        },
      ]);
    });
  });

  test("save codes", () => {
    initCodeStore();

    expect(codeStore.isCodeIdSaved(1)).toBeFalsy();
    expect(codeStore.lastSavedCodeIds()).toStrictEqual([]);

    codeStore.saveNewCode(2);
    codeStore.saveNewCode(1);
    codeStore.saveNewCode(3);
    expect(codeStore.lastSavedCodeIds()).toStrictEqual([3, 1, 2]);

    codeStore.removeSavedCode(4);
    codeStore.removeSavedCode(1);
    expect(codeStore.lastSavedCodeIds()).toStrictEqual([3, 2]);
  });
});
