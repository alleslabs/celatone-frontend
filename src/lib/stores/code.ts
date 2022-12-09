import localforage from "localforage";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

interface CodeLocalInfo {
  description?: string;
  uploader?: string;
}

interface SavedCodeInfo {
  id: number;
  description?: string;
  uploader?: string;
}

const isBrowser = typeof window !== "undefined";

export class CodeStore {
  private userKey: string;

  savedCodeIDs: Dict<string, number[]>;

  codeInfo: Dict<string, Dict<number, CodeLocalInfo>>;

  constructor() {
    this.savedCodeIDs = {};
    this.codeInfo = {};
    this.userKey = "";

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "CodeStore",
      properties: ["savedCodeIDs", "codeInfo"],
      storage: isBrowser ? localforage : undefined,
      stringify: false,
    });
  }

  setCodeUserKey(userKey: string) {
    this.userKey = userKey;
  }

  getCodeLocalInfo(userKey: string, id: number): CodeLocalInfo | undefined {
    return this.codeInfo[userKey]?.[id];
  }

  isCodeIDExist(userKey: string, id: number): boolean {
    return this.savedCodeIDs[userKey]?.includes(id) ?? false;
  }

  lastSavedCodeIDs(userKey: string): number[] {
    return this.savedCodeIDs[userKey]?.slice().reverse() ?? [];
  }

  lastSavedCodes(userKey: string): SavedCodeInfo[] {
    const savedCodeIDsByUserKey = this.savedCodeIDs[userKey];

    if (!savedCodeIDsByUserKey) return [];

    return savedCodeIDsByUserKey
      .map((codeId) => ({
        id: codeId,
        description: this.codeInfo[userKey]?.[codeId]?.description,
        uploader: this.codeInfo[userKey]?.[codeId]?.uploader,
      }))
      .reverse();
  }

  saveNewCode(userKey: string, id: number): void {
    if (this.savedCodeIDs[userKey]) {
      this.savedCodeIDs[userKey]?.push(id);
    } else {
      this.savedCodeIDs[userKey] = [id];
    }
  }

  removeSavedCode(userKey: string, id: number): void {
    this.savedCodeIDs[userKey] = this.savedCodeIDs[userKey]?.filter(
      (each) => each !== id
    );
  }

  updateCodeInfo(
    userKey: string,
    id: number,
    newCodeInfo: Partial<CodeLocalInfo>
  ): void {
    const codeInfo = this.codeInfo[userKey]?.[id];

    this.codeInfo[userKey] = {
      ...this.codeInfo[userKey],
      [id]: { ...codeInfo, ...newCodeInfo },
    };
  }
}
