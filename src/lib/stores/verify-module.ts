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

  isVerifyModuleUserKeyExist(): boolean {
    return !!this.userKey;
  }

  setVerifyModuleUserKey(userKey: string) {
    this.userKey = userKey;
  }

  isModuleVerified(taskId: string): boolean {
    return (
      this.getVerifyModules().findIndex((item) => item.taskId === taskId) > -1
    );
  }

  getVerifyModules(): VerifyModuleLocalInfo[] {
    return this.modules[this.userKey]?.reverse() ?? [];
  }

  getVerifyModule(taskId: string): VerifyModuleLocalInfo | undefined {
    return this.getVerifyModules().find((module) => module.taskId === taskId);
  }

  addVerifyModule(verifyModule: VerifyModuleLocalInfo): void {
    if (!this.isModuleVerified(verifyModule.taskId)) {
      this.modules[this.userKey] = [...this.getVerifyModules(), verifyModule];
    }
  }
}
