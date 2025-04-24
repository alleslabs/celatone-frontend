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
    chainId: "chainId",
    fileMap: { "coin.move": "sources/coin.move", "Move.toml": "Move.toml" },
    taskId: "taskId",
  };
  test("correctly get verify module tasks", () => {
    expect(moveVerifyTaskStore.latestMoveVerifyTasks()).toEqual([]);
  });

  test("correctly get verify module tasks after adding new task", () => {
    moveVerifyTaskStore.addMoveVerifyTask(verifyModule);
    expect(
      moveVerifyTaskStore.latestMoveVerifyTasks().map((task) => ({
        chainId: task.chainId,
        completed: task.completed,
        fileMap: task.fileMap,
        taskId: task.taskId,
      }))
    ).toEqual([
      {
        chainId: verifyModule.chainId,
        completed: false,
        fileMap: verifyModule.fileMap,
        taskId: verifyModule.taskId,
      },
    ]);
  });
  test("correctly get verify module tasks after adding multiple", () => {
    const verifyModule1 = {
      chainId: "chainId",
      fileMap: {
        "common.move": "sources/common.move",
        "Move.toml": "Move.toml",
      },
      taskId: "taskId1",
    };
    const verifyModule2 = {
      chainId: "chainId",
      fileMap: {
        "Move.toml": "Move.toml",
        "simple.move": "sources/simple.move",
      },
      taskId: "taskId2",
    };
    moveVerifyTaskStore.addMoveVerifyTask(verifyModule1);
    moveVerifyTaskStore.addMoveVerifyTask(verifyModule2);
    expect(moveVerifyTaskStore.latestMoveVerifyTasks().length).toBe(3);

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
