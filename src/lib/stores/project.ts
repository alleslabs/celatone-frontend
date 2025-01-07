import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

export interface PublicProject {
  logo: string;
  name: string;
  slug: string;
}

export class PublicProjectStore {
  publicProjects: Dict<string, PublicProject[]>; // user key

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  private userKey: string;

  constructor() {
    this.userKey = "";
    this.publicProjects = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "PublicProjectStore",
      properties: ["publicProjects"],
    });
  }

  getSavedPublicProjects(): PublicProject[] {
    return this.publicProjects[this.userKey] ?? [];
  }

  isProjectUserKeyExist(): boolean {
    return !!this.userKey;
  }

  isPublicProjectSaved(slug: string): boolean {
    const publicProjectByUserKey = this.getSavedPublicProjects();

    return publicProjectByUserKey.findIndex((x) => x.slug === slug) > -1;
  }

  removePublicProject(slug: string): void {
    this.publicProjects[this.userKey] = this.publicProjects[
      this.userKey
    ]?.filter((each) => each.slug !== slug);
  }

  savePublicProject(newProject: PublicProject): void {
    if (!this.isPublicProjectSaved(newProject.slug)) {
      this.publicProjects[this.userKey] = [
        ...this.getSavedPublicProjects(),
        newProject,
      ];
    }
  }

  setProjectUserKey(userKey: string) {
    this.userKey = userKey;
  }
}
