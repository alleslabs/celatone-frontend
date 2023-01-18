import { MdBookmark, MdInbox, MdLibraryBooks } from "react-icons/md";

import { MsgType } from "lib/types";

export const INSTANTIATED_LIST_NAME = "Instantiated by me";

export const SAVED_LIST_NAME = "Saved Contracts";

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

export const MAX_CODE_DESCRIPTION_LENGTH = 50;
export const getMaxCodeDescriptionLengthError = (currentLength: number) =>
  getMaxLengthError(
    "Code description",
    currentLength,
    MAX_CODE_DESCRIPTION_LENGTH
  );

export const getListIcon = (listName: string) => {
  switch (listName) {
    case INSTANTIATED_LIST_NAME:
      return MdInbox;
    case SAVED_LIST_NAME:
      return MdBookmark;
    default:
      return MdLibraryBooks;
  }
};

export const DEFAULT_ADDRESS = "default-address";

export const MAX_FILE_SIZE = 800_000;

export const CLEAR_ADMIN_GAS = 50_000;

export const MICRO = 1_000_000;

export const typeUrlDict = {
  [MsgType.STORE_CODE]: "/cosmwasm.wasm.v1.MsgStoreCode",
  [MsgType.INSTANTIATE]: "/cosmwasm.wasm.v1.MsgInstantiateContract",
  [MsgType.EXECUTE]: "/cosmwasm.wasm.v1.MsgExecuteContract",
};

export const DEFAULT_RPC_ERROR = "Invalid format, or Something went wrong";
// TODO
export const LCD_ENDPOINT: Record<string, string> = {
  osmosis: "https://lcd.osmosis.zone",
  osmosistestnet: "https://lcd-test.osmosis.zone",
};
