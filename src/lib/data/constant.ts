import { MdBookmark, MdInbox, MdLibraryBooks } from "react-icons/md";

import { MsgType } from "lib/types";

export const INSTANTIATED_LIST_NAME = "Instantiated by me";

export const SAVED_LIST_NAME = "Saved Contracts";

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

export const MICRO = 1000000;

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
