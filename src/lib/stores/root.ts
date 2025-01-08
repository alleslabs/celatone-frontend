import { AccountStore } from "./account";
import { LocalChainConfigStore } from "./chain-config";
import { CodeStore } from "./code";
import { ContractStore } from "./contract";
import { NetworkStore } from "./networks";
import { PublicProjectStore } from "./project";
import { SchemaStore } from "./schema";
import { MoveVerifyTaskStore } from "./verify-module";

export class RootStore {
  accountStore: AccountStore;

  codeStore: CodeStore;

  contractStore: ContractStore;

  publicProjectStore: PublicProjectStore;

  schemaStore: SchemaStore;

  networkStore: NetworkStore;

  localChainConfigStore: LocalChainConfigStore;

  moveVerifyTaskStore: MoveVerifyTaskStore;

  constructor() {
    this.accountStore = new AccountStore();
    this.codeStore = new CodeStore();
    this.contractStore = new ContractStore();
    this.publicProjectStore = new PublicProjectStore();
    this.schemaStore = new SchemaStore();
    this.networkStore = new NetworkStore();
    this.localChainConfigStore = new LocalChainConfigStore();
    this.moveVerifyTaskStore = new MoveVerifyTaskStore();
  }
}
