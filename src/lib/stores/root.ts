import { AccountStore } from "./account";
import { ChainConfigStore } from "./chain-config";
import { CodeStore } from "./code";
import { ContractStore } from "./contract";
import { NetworkStore } from "./networks";
import { PublicProjectStore } from "./project";
import { SchemaStore } from "./schema";

export class RootStore {
  accountStore: AccountStore;

  codeStore: CodeStore;

  contractStore: ContractStore;

  publicProjectStore: PublicProjectStore;

  schemaStore: SchemaStore;

  networkStore: NetworkStore;

  chainConfigStore: ChainConfigStore;

  constructor() {
    this.accountStore = new AccountStore();
    this.codeStore = new CodeStore();
    this.contractStore = new ContractStore();
    this.publicProjectStore = new PublicProjectStore();
    this.schemaStore = new SchemaStore();
    this.networkStore = new NetworkStore();
    this.chainConfigStore = new ChainConfigStore();
  }
}
