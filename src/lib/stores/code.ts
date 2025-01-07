import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { BechAddr, Dict } from "lib/types";

export interface CodeLocalInfo {
  id: number;
  name?: string;
  uploader: BechAddr;
}

export class CodeStore {
  codeInfo: Dict<string, Record<number, CodeLocalInfo>>;

  savedCodeIds: Dict<string, number[]>;

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  private userKey: string;

  constructor() {
    this.savedCodeIds = {};
    this.codeInfo = {};
    this.userKey = "";

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "CodeStore",
      properties: ["savedCodeIds", "codeInfo"],
    });
  }

  getCodeLocalInfo(id: number): CodeLocalInfo | undefined {
    return this.codeInfo[this.userKey]?.[id];
  }

  isCodeIdSaved(id: number): boolean {
    return this.savedCodeIds[this.userKey]?.includes(id) ?? false;
  }

  isCodeUserKeyExist(): boolean {
    return !!this.userKey;
  }

  lastSavedCodeIds(): number[] {
    return this.savedCodeIds[this.userKey]?.slice().reverse() ?? [];
  }

  lastSavedCodes(): CodeLocalInfo[] {
    const savedCodeIdsByUserKey = this.savedCodeIds[this.userKey];

    if (!savedCodeIdsByUserKey) return [];

    return savedCodeIdsByUserKey
      .map((codeId) => ({
        id: codeId,
        name: this.codeInfo[this.userKey]?.[codeId]?.name,
        uploader:
          this.codeInfo[this.userKey]?.[codeId]?.uploader ??
          ("N/A" as BechAddr),
      }))
      .reverse();
  }

  removeSavedCode(id: number): void {
    this.savedCodeIds[this.userKey] = this.savedCodeIds[this.userKey]?.filter(
      (each) => each !== id
    );
  }

  saveNewCode(id: number): void {
    if (this.savedCodeIds[this.userKey]) {
      this.savedCodeIds[this.userKey]?.push(id);
    } else {
      this.savedCodeIds[this.userKey] = [id];
    }
  }

  setCodeUserKey(userKey: string) {
    this.userKey = userKey;
  }

  updateCodeInfo(id: number, uploader: BechAddr, name?: string): void {
    const codeInfo = this.codeInfo[this.userKey]?.[id] || { id, uploader };

    if (name !== undefined) {
      codeInfo.name = name.trim().length ? name.trim() : undefined;
    }

    this.codeInfo[this.userKey] = {
      ...this.codeInfo[this.userKey],
      [id]: codeInfo,
    };
  }
}
