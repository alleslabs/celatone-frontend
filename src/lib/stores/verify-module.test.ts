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

describe("isVerifyModuleTaskUserKeyExist", () => {
  test("correctly check if user key exist", () => {
    expect(verifyModuleTaskStore.isVerifyModuleTaskUserKeyExist()).toBeFalsy();
    verifyModuleTaskStore.setVerifyModuleTaskUserKey("userKey");
    expect(verifyModuleTaskStore.isVerifyModuleTaskUserKeyExist()).toBeTruthy();
  });
});

describe("verifyModule", () => {
  const verifyModule = {
    taskId: "taskId",
    fileMap: { file: "map" },
    chainId: "chainId",
  };
  test("correctly get verify modules", () => {
    expect(verifyModuleTaskStore.getVerifyModuleTaskTasks()).toEqual([]);
  });

  test("correctly get verify modules after adding", () => {
    verifyModuleTaskStore.addVerifyModuleTask(verifyModule);
    expect(verifyModuleTaskStore.getVerifyModuleTaskTasks()).toEqual([
      verifyModule,
    ]);
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
    verifyModuleTaskStore.addVerifyModuleTask(verifyModule1);
    verifyModuleTaskStore.addVerifyModuleTask(verifyModule2);
    expect(verifyModuleTaskStore.getVerifyModuleTaskTasks()).toEqual([
      verifyModule2,
      verifyModule1,
      verifyModule,
    ]);
  });
  test("correctly check if module is verified", () => {
    expect(
      verifyModuleTaskStore.isVerifyModuleTaskExist(verifyModule.taskId)
    ).toBeTruthy();
    expect(
      verifyModuleTaskStore.isVerifyModuleTaskExist("randomId")
    ).toBeFalsy();
  });
});
