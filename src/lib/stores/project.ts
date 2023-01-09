import { makeAutoObservable } from "mobx";
import { isHydrated, makePersistable } from "mobx-persist-store";

import type { Dict } from "lib/types";

export interface PublicProject {
  name: string;
  slug: string;
  logo: string;
}

export class PublicProjectStore {
  private userKey: string;

  publicProjects: Dict<string, PublicProject[]>; // user key

  constructor() {
    this.userKey = "";
    this.publicProjects = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "PublicProjectStore",
      properties: ["publicProjects"],
    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  isProjectUserKeyExist(): boolean {
    return !!this.userKey;
  }

  setProjectUserKey(userKey: string) {
    this.userKey = userKey;
  }

  getPublicProjects(): PublicProject[] {
    return this.publicProjects[this.userKey] ?? [];
  }

  isPublicProjectSaved(slug: string): boolean {
    const publicProjectByUserKey = this.getPublicProjects();

    return !!publicProjectByUserKey.find((x) => x.slug === slug);
  }

  savePublicProject(newProject: PublicProject): void {
    if (!this.isPublicProjectSaved(newProject.slug)) {
      this.publicProjects[this.userKey] = [
        ...this.getPublicProjects(),
        newProject,
      ];
    }
  }

  removePublicProject(slug: string): void {
    this.publicProjects[this.userKey] = this.publicProjects[
      this.userKey
    ]?.filter((each) => each.slug !== slug);
  }
}
