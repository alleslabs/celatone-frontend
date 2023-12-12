import type {
  BaseTxFilters,
  InitiaTxFilters,
  LVPair,
  MoveTxFilters,
  TxFilters,
  WasmTxFilters,
} from "lib/types";
import { MsgType } from "lib/types";
/**
 * @todos Revisit utils import later
 */
import { formatSlugName } from "lib/utils/format";

export const INSTANTIATED_LIST_NAME = "Instantiated by me";

export const SAVED_LIST_NAME = "Saved Contracts";

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
  [MsgType.STORE_CODE]: "/cosmwasm.wasm.v1.MsgStoreCode",
  [MsgType.INSTANTIATE]: "/cosmwasm.wasm.v1.MsgInstantiateContract",
  [MsgType.EXECUTE]: "/cosmwasm.wasm.v1.MsgExecuteContract",
  [MsgType.MIGRATE]: "/cosmwasm.wasm.v1.MsgMigrateContract",
  [MsgType.UPDATE_ADMIN]: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
  [MsgType.SUBMIT_PROPOSAL]: "/cosmos.gov.v1beta1.MsgSubmitProposal",
};

export const DEFAULT_RPC_ERROR = "Invalid format, or Something went wrong";

export const DEFAULT_BASE_TX_FILTERS: BaseTxFilters = {
  isSend: false,
  isIbc: false,
};

export const DEFAULT_WASM_TX_FILTERS: WasmTxFilters = {
  isInstantiate: false,
  isStoreCode: false,
  isExecute: false,
  isMigrate: false,
  isUpdateAdmin: false,
  isClearAdmin: false,
};

export const DEFAULT_MOVE_TX_FILTERS: MoveTxFilters = {
  isMovePublish: false,
  isMoveUpgrade: false,
  isMoveExecute: false,
  isMoveScript: false,
};

export const INITIA_TX_FILTERS: InitiaTxFilters = {
  isOpInit: false,
};

export const DEFAULT_TX_FILTERS: TxFilters = {
  ...DEFAULT_BASE_TX_FILTERS,
  ...DEFAULT_WASM_TX_FILTERS,
  ...DEFAULT_MOVE_TX_FILTERS,
};

export const UPPERBOUND_COUNT = 10000;

export enum StorageKeys {
  NavSidebar = "nav-sidebar",
  DevSidebar = "dev-sidebar",
  ProjectSidebar = "project-sidebar",
  Wallets = "wallets",
  Networks = "networks",
}

export const HEX_WALLET_ADDRESS_LENGTH = 40;
export const HEX_MODULE_ADDRESS_LENGTH = 64;
