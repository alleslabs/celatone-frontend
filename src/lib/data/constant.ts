import type { IconKeys } from "lib/components/icon";
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

export const getMaxLengthError = (
  field: string,
  currentLength: number,
  maxLength: number
) => {
  return `${field} is too long. (${currentLength}/${maxLength})`;
};

export const MAX_LIST_NAME_LENGTH = 50;
export const getMaxListNameLengthError = (currentLength: number) =>
  getMaxLengthError("List name", currentLength, MAX_LIST_NAME_LENGTH);

export const MAX_CONTRACT_NAME_LENGTH = 50;
export const getMaxContractNameLengthError = (currentLength: number) =>
  getMaxLengthError("Contract name", currentLength, MAX_CONTRACT_NAME_LENGTH);

export const MAX_CONTRACT_DESCRIPTION_LENGTH = 250;
export const getMaxContractDescriptionLengthError = (currentLength: number) =>
  getMaxLengthError(
    "Contract description",
    currentLength,
    MAX_CONTRACT_DESCRIPTION_LENGTH
  );

export const MAX_CODE_NAME_LENGTH = 50;
export const getMaxCodeNameLengthError = (currentLength: number) =>
  getMaxLengthError("Code name", currentLength, MAX_CODE_NAME_LENGTH);

export const getListIcon = (listName: string): IconKeys => {
  switch (listName) {
    case INSTANTIATED_LIST_NAME:
      return "wallet";
    case SAVED_LIST_NAME:
      return "bookmark-solid";
    default:
      return "contract-list";
  }
};

export const DEFAULT_LIST: LVPair[] = [
  {
    label: SAVED_LIST_NAME,
    value: formatSlugName(SAVED_LIST_NAME),
  },
];

export const DEFAULT_ADDRESS = "default-address";

export const MAX_FILE_SIZE = 800_000;

export const CLEAR_ADMIN_GAS = 50_000;

export const MICRO = 1_000_000;

export const typeUrlDict = {
  [MsgType.STORE_CODE]: "/cosmwasm.wasm.v1.MsgStoreCode",
  [MsgType.INSTANTIATE]: "/cosmwasm.wasm.v1.MsgInstantiateContract",
  [MsgType.EXECUTE]: "/cosmwasm.wasm.v1.MsgExecuteContract",
  [MsgType.MIGRATE]: "/cosmwasm.wasm.v1.MsgMigrateContract",
  [MsgType.UPDATE_ADMIN]: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
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
