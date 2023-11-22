import { AccountStore } from "./account";
import { CodeStore } from "./code";
import { ContractStore } from "./contract";
import { PublicProjectStore } from "./project";
import { SchemaStore } from "./schema";

export class RootStore {
  accountStore: AccountStore;

  codeStore: CodeStore;

  contractStore: ContractStore;

  publicProjectStore: PublicProjectStore;

  schemaStore: SchemaStore;

  constructor() {
    this.accountStore = new AccountStore();
    this.codeStore = new CodeStore();
    this.contractStore = new ContractStore();
    this.publicProjectStore = new PublicProjectStore();
    this.schemaStore = new SchemaStore();
  }
}
