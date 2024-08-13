import { VerifyModuleStore } from "./verify-module";

let verifyModuleStore: VerifyModuleStore;

beforeAll(() => {
  verifyModuleStore = new VerifyModuleStore();
});

describe("VerifyModuleStore initialization", () => {
  test("Correctly initialize VerifyModuleStore", () => {
    expect(verifyModuleStore instanceof VerifyModuleStore).toBeTruthy();
  });
});

describe("isVerifyModuleUserKeyExist", () => {
  test("correctly check if user key exist", () => {
    expect(verifyModuleStore.isVerifyModuleUserKeyExist()).toBeFalsy();
    verifyModuleStore.setVerifyModuleUserKey("userKey");
    expect(verifyModuleStore.isVerifyModuleUserKeyExist()).toBeTruthy();
  });
});

describe("verifyModule", () => {
  const verifyModule = {
    requestId: "requestId",
    fileMap: { file: "map" },
    chainId: "chainId",
  };
  test("correctly get verify modules", () => {
    expect(verifyModuleStore.getVerifyModules()).toEqual([]);
  });

  test("correctly get verify modules after adding", () => {
    verifyModuleStore.addVerifyModule(verifyModule);
    expect(verifyModuleStore.getVerifyModules()).toEqual([verifyModule]);
  });
  test("correctly get verify modules after adding multiple", () => {
    const verifyModule1 = {
      requestId: "requestId1",
      fileMap: { file: "map" },
      chainId: "chainId",
    };
    const verifyModule2 = {
      requestId: "requestId2",
      fileMap: { file: "map" },
      chainId: "chainId",
    };
    verifyModuleStore.addVerifyModule(verifyModule1);
    verifyModuleStore.addVerifyModule(verifyModule2);
    expect(verifyModuleStore.getVerifyModules()).toEqual([
      verifyModule,
      verifyModule1,
      verifyModule2,
    ]);
  });
  test("correctly check if module is verified", () => {
    expect(
      verifyModuleStore.isModuleVerified(verifyModule.requestId)
    ).toBeTruthy();
    expect(verifyModuleStore.isModuleVerified("randomId")).toBeFalsy();
  });
});
