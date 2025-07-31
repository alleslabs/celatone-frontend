import type {
  BaseTxFilters,
  InitiaTxFilters,
  LVPair,
  MoveTxFilters,
  TxFilters,
  WasmTxFilters,
} from "lib/types";

import { MsgType } from "lib/types/tx/msg";
// TODO: Revisit utils import later
import { formatSlugName } from "lib/utils/format";

export const USER_GUIDE_DOCS_LINK = "https://docs.alleslabs.com/user-guide";

export const DEVELOPER_TOOL_DOCS_LINK = "https://docs.alleslabs.com/developers";

export const CHAIN_PROFILE_URL = "https://registry.initia.xyz/profiles.json";

export const INITIA_WEBSITE_URL = "https://initia.xyz";

export const INITIA_REGISTRY_URLS = [
  "https://registry.initia.xyz",
  "https://registry.testnet.initia.xyz",
];

export const INSTANTIATED_LIST_NAME = "Instantiated by me";

export const SAVED_LIST_NAME = "Saved contracts";

// special slug with all cap letters to avoid conflict with any list
export const ADMIN_SPECIAL_SLUG = "ADMIN";

export const DEFAULT_LIST: LVPair[] = [
  {
    label: SAVED_LIST_NAME,
    value: formatSlugName(SAVED_LIST_NAME),
  },
];

export const DEFAULT_ADDRESS = "default-address";

export const typeUrlDict = {
  [MsgType.EXECUTE]: "/cosmwasm.wasm.v1.MsgExecuteContract",
  [MsgType.INSTANTIATE]: "/cosmwasm.wasm.v1.MsgInstantiateContract",
  [MsgType.MIGRATE]: "/cosmwasm.wasm.v1.MsgMigrateContract",
  [MsgType.STORE_CODE]: "/cosmwasm.wasm.v1.MsgStoreCode",
  [MsgType.SUBMIT_PROPOSAL]: "/cosmos.gov.v1beta1.MsgSubmitProposal",
  [MsgType.UPDATE_ADMIN]: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
};

export const DEFAULT_RPC_ERROR = "Invalid format, or Something went wrong";

export const DEFAULT_BASE_TX_FILTERS: BaseTxFilters = {
  isIbc: false,
  isSend: false,
};

export const DEFAULT_WASM_TX_FILTERS: WasmTxFilters = {
  isClearAdmin: false,
  isExecute: false,
  isInstantiate: false,
  isMigrate: false,
  isStoreCode: false,
  isUpdateAdmin: false,
};

export const DEFAULT_MOVE_TX_FILTERS: MoveTxFilters = {
  isMoveExecute: false,
  isMovePublish: false,
  isMoveScript: false,
};

export const DEFAULT_INITIA_TX_FILTERS: InitiaTxFilters = {
  isOpinit: false,
};

export const DEFAULT_TX_FILTERS: TxFilters = {
  ...DEFAULT_BASE_TX_FILTERS,
  ...DEFAULT_WASM_TX_FILTERS,
  ...DEFAULT_MOVE_TX_FILTERS,
  ...DEFAULT_INITIA_TX_FILTERS,
};

export enum StorageKeys {
  Annoucement = "annoucement",
  DevSidebar = "dev-sidebar",
  NavSidebar = "nav-sidebar",
  Networks = "networks",
  ProjectSidebar = "project-sidebar",
  Wallets = "wallets",
}

export const HEX_WALLET_ADDRESS_LENGTH = 40;
export const HEX_MODULE_ADDRESS_LENGTH = 64;

export const UPPERBOUND_COUNT = 10000;
