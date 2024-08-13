import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

export interface VerifyModuleLocalInfo {
  requestId: string;
  requestNote?: string;
  chainId: string;
  fileMap: Record<string, string>;
}

export class VerifyModuleStore {
  private userKey: string;

  modules: Dict<string, VerifyModuleLocalInfo[]>;

  constructor() {
    this.userKey = "";
    this.modules = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "VerifyModuleStore",
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

  getVerifyModules(): VerifyModuleLocalInfo[] {
    return this.modules[this.userKey] ?? [];
  }

  isModuleVerified(requestId: string): boolean {
    return (
      this.getVerifyModules().findIndex(
        (item) => item.requestId === requestId
      ) > -1
    );
  }

  addVerifyModule(verifyModule: VerifyModuleLocalInfo): void {
    if (!this.isModuleVerified(verifyModule.requestId)) {
      this.modules[this.userKey] = [...this.getVerifyModules(), verifyModule];
    }
  }
}
