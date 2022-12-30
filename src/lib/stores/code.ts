import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

export interface CodeLocalInfo {
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

  savedCodeIds: Dict<string, number[]>;

  codeInfo: Dict<string, Dict<number, CodeLocalInfo>>;

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

  isCodeUserKeyExist(): boolean {
    return !!this.userKey;
  }

  setCodeUserKey(userKey: string) {
    this.userKey = userKey;
  }

  getCodeLocalInfo(id: number): CodeLocalInfo | undefined {
    return this.codeInfo[this.userKey]?.[id];
  }

  isCodeIdExist(id: number): boolean {
    return this.savedCodeIds[this.userKey]?.includes(id) ?? false;
  }

  lastSavedCodeIds(userKey: string): number[] {
    return this.savedCodeIds[userKey]?.slice().reverse() ?? [];
  }

  lastSavedCodes(userKey: string): SavedCodeInfo[] {
    const savedCodeIdsByUserKey = this.savedCodeIds[userKey];

    if (!savedCodeIdsByUserKey) return [];

    return savedCodeIdsByUserKey
      .map((codeId) => ({
        id: codeId,
        description: this.codeInfo[userKey]?.[codeId]?.description,
        uploader: this.codeInfo[userKey]?.[codeId]?.uploader,
      }))
      .reverse();
  }

  saveNewCode(id: number): void {
    if (this.savedCodeIds[this.userKey]) {
      this.savedCodeIds[this.userKey]?.push(id);
    } else {
      this.savedCodeIds[this.userKey] = [id];
    }
  }

  removeSavedCode(id: number): void {
    this.savedCodeIds[this.userKey] = this.savedCodeIds[this.userKey]?.filter(
      (each) => each !== id
    );
  }

  updateCodeInfo(id: number, newCodeInfo: CodeLocalInfo): void {
    const codeInfo = this.codeInfo[this.userKey]?.[id] || {};

    if (newCodeInfo.description !== undefined) {
      codeInfo.description = newCodeInfo.description.trim().length
        ? newCodeInfo.description.trim()
        : undefined;
    }
    if (newCodeInfo.uploader !== undefined)
      codeInfo.uploader = newCodeInfo.uploader;

    this.codeInfo[this.userKey] = {
      ...this.codeInfo[this.userKey],
      [id]: codeInfo,
    };
  }
}
