import { useCallback } from "react";

import { useTrack } from "lib/amplitude";
import { catchTxError } from "lib/app-fns/tx/common";

// HACK: This shouldn't be here. It should be in src/lib/app-fns/tx/common/catchTxError.ts
export type CatchTxError = ReturnType<typeof useCatchTxError>;

export const useCatchTxError = () => {
  const { trackTxFailed, trackTxRejected } = useTrack();

  return useCallback(
    (onTxFailed?: () => void) =>
      catchTxError(trackTxFailed, trackTxRejected, onTxFailed),
    [trackTxFailed, trackTxRejected]
  );
};
