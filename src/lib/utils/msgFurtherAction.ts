import type { TxFilters } from "lib/types";

import { MsgFurtherAction } from "lib/types";

export const getMsgFurtherAction = (
  length: number,
  filters: Partial<TxFilters>,
  isSuccess: boolean,
  isSigner: boolean
) => {
  // Redo: instantiate, execute, check length === 1
  if (
    isSigner &&
    length === 1 &&
    (filters.isExecute || filters.isInstantiate)
  ) {
    return MsgFurtherAction.REDO;
  }
  // Resend: messages with execute, instantiate, or send with success transaction
  if (
    isSigner &&
    !filters.isClearAdmin &&
    !filters.isStoreCode &&
    !filters.isIbc &&
    !filters.isClearAdmin &&
    !filters.isMigrate &&
    !filters.isUpdateAdmin &&
    (filters.isSend ||
      filters.isExecute ||
      filters.isInstantiate ||
      filters.isMoveExecute) &&
    isSuccess
  ) {
    return MsgFurtherAction.RESEND;
  }
  return MsgFurtherAction.NONE;
};
