import { VerifyModuleTaskStore } from "./verify-module";

let verifyModuleTaskStore: VerifyModuleTaskStore;

beforeAll(() => {
  verifyModuleTaskStore = new VerifyModuleTaskStore();
});

describe("VerifyModuleTaskStore initialization", () => {
  test("Correctly initialize VerifyModuleTaskStore", () => {
    expect(verifyModuleTaskStore instanceof VerifyModuleTaskStore).toBeTruthy();
  });
});

describe("isVerifyModuleUserKeyExist", () => {
  test("correctly check if user key exist", () => {
    expect(verifyModuleTaskStore.isVerifyModuleUserKeyExist()).toBeFalsy();
    verifyModuleTaskStore.setVerifyModuleUserKey("userKey");
    expect(verifyModuleTaskStore.isVerifyModuleUserKeyExist()).toBeTruthy();
  });
});

describe("verifyModule", () => {
  const verifyModule = {
    taskId: "taskId",
    fileMap: { file: "map" },
    chainId: "chainId",
  };
  test("correctly get verify modules", () => {
    expect(verifyModuleTaskStore.getVerifyModules()).toEqual([]);
  });

  test("correctly get verify modules after adding", () => {
    verifyModuleTaskStore.addVerifyModule(verifyModule);
    expect(verifyModuleTaskStore.getVerifyModules()).toEqual([verifyModule]);
  });
  test("correctly get verify modules after adding multiple", () => {
    const verifyModule1 = {
      taskId: "taskId1",
      fileMap: { file: "map" },
      chainId: "chainId",
    };
    const verifyModule2 = {
      taskId: "taskId2",
      fileMap: { file: "map" },
      chainId: "chainId",
    };
    verifyModuleTaskStore.addVerifyModule(verifyModule1);
    verifyModuleTaskStore.addVerifyModule(verifyModule2);
    expect(verifyModuleTaskStore.getVerifyModules()).toEqual([
      verifyModule2,
      verifyModule1,
      verifyModule,
    ]);
  });
  test("correctly check if module is verified", () => {
    expect(
      verifyModuleTaskStore.isModuleVerified(verifyModule.taskId)
    ).toBeTruthy();
    expect(verifyModuleTaskStore.isModuleVerified("randomId")).toBeFalsy();
  });
});
