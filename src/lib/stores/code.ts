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
    newCodeInfo: CodeLocalInfo
  ): void {
    const codeInfo = this.codeInfo[userKey]?.[id] || {};

    if (newCodeInfo.description !== undefined) {
      codeInfo.description = newCodeInfo.description.trim().length
        ? newCodeInfo.description.trim()
        : undefined;
    }
    if (newCodeInfo.uploader !== undefined)
      codeInfo.uploader = newCodeInfo.uploader;

    this.codeInfo[userKey] = {
      ...this.codeInfo[userKey],
      [id]: codeInfo,
    };
  }
}
