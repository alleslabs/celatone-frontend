import { MoveVerifyTaskStore } from "./verify-module";

let moveVerifyTaskStore: MoveVerifyTaskStore;

beforeAll(() => {
  moveVerifyTaskStore = new MoveVerifyTaskStore();
});

describe("MoveVerifyTaskStore initialization", () => {
  test("Correctly initialize MoveVerifyTaskStore", () => {
    expect(moveVerifyTaskStore instanceof MoveVerifyTaskStore).toBeTruthy();
  });
});

describe("isMoveVerifyTaskUserKeyExist", () => {
  test("correctly check if user key exist", () => {
    expect(moveVerifyTaskStore.isMoveVerifyTaskUserKeyExist()).toBeFalsy();
    moveVerifyTaskStore.setMoveVerifyTaskUserKey("userKey");
    expect(moveVerifyTaskStore.isMoveVerifyTaskUserKeyExist()).toBeTruthy();
  });
});

describe("verifyModuleTask", () => {
  const verifyModule = {
    taskId: "taskId",
    fileMap: { "coin.move": "sources/coin.move", "Move.toml": "Move.toml" },
    chainId: "chainId",
  };
  test("correctly get verify module tasks", () => {
    expect(moveVerifyTaskStore.getMoveVerifyTasks()).toEqual([]);
  });

  test("correctly get verify module tasks after adding new task", () => {
    moveVerifyTaskStore.addMoveVerifyTask(verifyModule);
    expect(
      moveVerifyTaskStore.getMoveVerifyTasks().map((task) => ({
        taskId: task.taskId,
        fileMap: task.fileMap,
        chainId: task.chainId,
        completed: task.completed,
      }))
    ).toEqual([
      {
        taskId: verifyModule.taskId,
        fileMap: verifyModule.fileMap,
        chainId: verifyModule.chainId,
        completed: false,
      },
    ]);
  });
  test("correctly get verify module tasks after adding multiple", () => {
    const verifyModule1 = {
      taskId: "taskId1",
      fileMap: {
        "common.move": "sources/common.move",
        "Move.toml": "Move.toml",
      },
      chainId: "chainId",
    };
    const verifyModule2 = {
      taskId: "taskId2",
      fileMap: {
        "simple.move": "sources/simple.move",
        "Move.toml": "Move.toml",
      },
      chainId: "chainId",
    };
    moveVerifyTaskStore.addMoveVerifyTask(verifyModule1);
    moveVerifyTaskStore.addMoveVerifyTask(verifyModule2);
    expect(moveVerifyTaskStore.getMoveVerifyTasks().length).toBe(3);

    const actualVerifyModuleTask1 = moveVerifyTaskStore.getMoveVerifyTask(
      verifyModule1.taskId
    );
    const actualVerifyModuleTask2 = moveVerifyTaskStore.getMoveVerifyTask(
      verifyModule2.taskId
    );

    expect(actualVerifyModuleTask1?.taskId).toBe(verifyModule1.taskId);
    expect(actualVerifyModuleTask1?.fileMap).toEqual(verifyModule1.fileMap);
    expect(actualVerifyModuleTask1?.chainId).toBe(verifyModule1.chainId);
    expect(actualVerifyModuleTask1?.completed).toBeFalsy();

    expect(actualVerifyModuleTask2?.taskId).toBe(verifyModule2.taskId);
    expect(actualVerifyModuleTask2?.fileMap).toEqual(verifyModule2.fileMap);
    expect(actualVerifyModuleTask2?.chainId).toBe(verifyModule2.chainId);
    expect(actualVerifyModuleTask2?.completed).toBeFalsy();
  });
  test("correctly check if verify module tasks is added", () => {
    expect(
      moveVerifyTaskStore.isMoveVerifyTaskExist(verifyModule.taskId)
    ).toBeTruthy();
    expect(moveVerifyTaskStore.isMoveVerifyTaskExist("randomId")).toBeFalsy();
  });
  test("update verify module task", () => {
    const verifiedAt = new Date();
    moveVerifyTaskStore.completeMoveVerifyTask(verifyModule.taskId, verifiedAt);

    const actual = moveVerifyTaskStore.getMoveVerifyTask(verifyModule.taskId);
    expect(actual?.completed).toBeTruthy();
    expect(actual?.verifiedAt).toEqual(verifiedAt);
  });
});
