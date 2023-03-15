import type { TxFilters } from "lib/types";
import { MsgFurtherAction } from "lib/types";

export const getMsgFurtherAction = (
  length: number,
  filters: TxFilters,
  isSuccess: boolean
) => {
  // Redo: instantiate, execute, check length === 1
  if (length === 1 && (filters.isExecute || filters.isInstantiate)) {
    return MsgFurtherAction.REDO;
  }
  // Resend: messages with execute, instantiate, or send with success transaction
  if (
    !filters.isClearAdmin &&
    !filters.isUpload &&
    !filters.isIbc &&
    !filters.isClearAdmin &&
    !filters.isMigrate &&
    !filters.isUpdateAdmin &&
    (filters.isExecute || filters.isInstantiate || filters.isSend) &&
    isSuccess
  ) {
    return MsgFurtherAction.RESEND;
  }
  return MsgFurtherAction.NONE;
};
