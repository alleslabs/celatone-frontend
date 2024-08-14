import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

export interface VerifyModuleLocalInfo {
  taskId: string;
  requestNote?: string;
  chainId: string;
  fileMap: Record<string, string>;
}

export class VerifyModuleTaskStore {
  private userKey: string;

  modules: Dict<string, VerifyModuleLocalInfo[]>;

  constructor() {
    this.userKey = "";
    this.modules = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "VerifyModuleTaskStore",
      properties: ["modules"],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  isVerifyModuleTaskUserKeyExist(): boolean {
    return !!this.userKey;
  }

  setVerifyModuleTaskUserKey(userKey: string) {
    this.userKey = userKey;
  }

  isVerifyModuleTaskExist(taskId: string): boolean {
    return (
      this.getVerifyModuleTaskTasks().findIndex(
        (item) => item.taskId === taskId
      ) > -1
    );
  }

  getVerifyModuleTaskTasks(): VerifyModuleLocalInfo[] {
    return this.modules[this.userKey]?.reverse() ?? [];
  }

  getVerifyModuleTask(taskId: string): VerifyModuleLocalInfo | undefined {
    return this.getVerifyModuleTaskTasks().find(
      (module) => module.taskId === taskId
    );
  }

  addVerifyModuleTask(verifyModule: VerifyModuleLocalInfo): void {
    if (!this.isVerifyModuleTaskExist(verifyModule.taskId)) {
      this.modules[this.userKey] = [
        ...this.getVerifyModuleTaskTasks(),
        verifyModule,
      ];
    }
  }
}
