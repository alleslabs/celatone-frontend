import { CodeStore } from "./code";
import { ContractStore } from "./contract";

export class RootStore {
  codeStore: CodeStore;

  contractStore: ContractStore;

  constructor() {
    this.codeStore = new CodeStore();
    this.contractStore = new ContractStore();
  }
}
