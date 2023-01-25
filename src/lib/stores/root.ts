import { CodeStore } from "./code";
import { ContractStore } from "./contract";
import { PublicProjectStore } from "./project";

export class RootStore {
  codeStore: CodeStore;

  contractStore: ContractStore;

  publicProjectStore: PublicProjectStore;

  constructor() {
    this.codeStore = new CodeStore();
    this.contractStore = new ContractStore();
    this.publicProjectStore = new PublicProjectStore();
  }
}
