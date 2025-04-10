import type { Dict } from "lib/types";

import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

export interface MoveVerifyTaskLocalInfo {
  taskId: string;
  requestNote?: string;
  chainId: string;
  fileMap: Record<string, string>;
  created: Date;
  verifiedAt?: Date;
  completed: boolean;
}

export class MoveVerifyTaskStore {
  private userKey: string;

  modules: Dict<string, MoveVerifyTaskLocalInfo[]>;

  constructor() {
    this.userKey = "";
    this.modules = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "MoveVerifyTaskStore",
      properties: ["modules"],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  isMoveVerifyTaskUserKeyExist(): boolean {
    return !!this.userKey;
  }

  setMoveVerifyTaskUserKey(userKey: string) {
    this.userKey = userKey;
  }

  isMoveVerifyTaskExist(taskId: string): boolean {
    return (
      this.getMoveVerifyTasks().findIndex((item) => item.taskId === taskId) > -1
    );
  }

  getMoveVerifyTasks(): MoveVerifyTaskLocalInfo[] {
    return this.modules[this.userKey] ?? [];
  }

  latestMoveVerifyTasks(): MoveVerifyTaskLocalInfo[] {
    return this.getMoveVerifyTasks().slice().reverse();
  }

  getMoveVerifyTask(taskId: string): MoveVerifyTaskLocalInfo | undefined {
    return this.getMoveVerifyTasks().find((module) => module.taskId === taskId);
  }

  addMoveVerifyTask(
    verifyModule: Omit<
      MoveVerifyTaskLocalInfo,
      "created" | "completed" | "verifiedAt"
    >
  ): void {
    if (!this.isMoveVerifyTaskExist(verifyModule.taskId)) {
      this.modules[this.userKey] = [
        ...this.getMoveVerifyTasks(),
        { ...verifyModule, created: new Date(), completed: false },
      ];
    }
  }

  completeMoveVerifyTask(taskId: string, verifiedAt?: Date): void {
    const modules = this.getMoveVerifyTasks().map((module) =>
      module.taskId === taskId
        ? { ...module, verifiedAt, completed: true }
        : module
    );
    this.modules[this.userKey] = modules;
  }

  updateRequestNote(taskId: string, newRequestNote?: string): void {
    const modules = this.getMoveVerifyTasks().map((module) =>
      module.taskId === taskId
        ? { ...module, requestNote: newRequestNote }
        : module
    );
    this.modules[this.userKey] = modules;
  }
}
