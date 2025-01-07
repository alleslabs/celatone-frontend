import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

export interface MoveVerifyTaskLocalInfo {
  chainId: string;
  completed: boolean;
  created: Date;
  fileMap: Record<string, string>;
  requestNote?: string;
  taskId: string;
  verifiedAt?: Date;
}

export class MoveVerifyTaskStore {
  modules: Dict<string, MoveVerifyTaskLocalInfo[]>;

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  private userKey: string;

  constructor() {
    this.userKey = "";
    this.modules = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "MoveVerifyTaskStore",
      properties: ["modules"],
    });
  }

  addMoveVerifyTask(
    verifyModule: Omit<
      MoveVerifyTaskLocalInfo,
      "completed" | "created" | "verifiedAt"
    >
  ): void {
    if (!this.isMoveVerifyTaskExist(verifyModule.taskId)) {
      this.modules[this.userKey] = [
        ...this.getMoveVerifyTasks(),
        { ...verifyModule, completed: false, created: new Date() },
      ];
    }
  }

  completeMoveVerifyTask(taskId: string, verifiedAt?: Date): void {
    const modules = this.getMoveVerifyTasks().map((module) =>
      module.taskId === taskId
        ? { ...module, completed: true, verifiedAt }
        : module
    );
    this.modules[this.userKey] = modules;
  }

  getMoveVerifyTask(taskId: string): MoveVerifyTaskLocalInfo | undefined {
    return this.getMoveVerifyTasks().find((module) => module.taskId === taskId);
  }

  getMoveVerifyTasks(): MoveVerifyTaskLocalInfo[] {
    return this.modules[this.userKey] ?? [];
  }

  isMoveVerifyTaskExist(taskId: string): boolean {
    return (
      this.getMoveVerifyTasks().findIndex((item) => item.taskId === taskId) > -1
    );
  }

  isMoveVerifyTaskUserKeyExist(): boolean {
    return !!this.userKey;
  }

  latestMoveVerifyTasks(): MoveVerifyTaskLocalInfo[] {
    return this.getMoveVerifyTasks().slice().reverse();
  }

  setMoveVerifyTaskUserKey(userKey: string) {
    this.userKey = userKey;
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
