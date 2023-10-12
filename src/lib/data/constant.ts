import type { LVPair } from "lib/types";
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

export const DEFAULT_TX_FILTERS = {
  isExecute: false,
  isInstantiate: false,
  isUpload: false,
  isIbc: false,
  isSend: false,
  isMigrate: false,
  isUpdateAdmin: false,
  isClearAdmin: false,
};

export const UPPERBOUND_COUNT = 10000;

export enum StorageKeys {
  NavSidebar = "nav-sidebar",
  DevSidebar = "dev-sidebar",
  ProjectSidebar = "project-sidebar",
  Wallets = "wallets",
  Networks = "networks",
}
