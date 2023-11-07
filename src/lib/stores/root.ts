import { AccountStore } from "./account";
import { CodeStore } from "./code";
import { ContractStore } from "./contract";
import { PublicProjectStore } from "./project";
import { SchemaStore } from "./schema";

export class RootStore {
  codeStore: CodeStore;

  contractStore: ContractStore;

  accountStore: AccountStore;

  publicProjectStore: PublicProjectStore;

  schemaStore: SchemaStore;

  constructor() {
    this.codeStore = new CodeStore();
    this.contractStore = new ContractStore();
    this.accountStore = new AccountStore();
    this.publicProjectStore = new PublicProjectStore();
    this.schemaStore = new SchemaStore();
  }
}
