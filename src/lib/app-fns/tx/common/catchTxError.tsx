import type {
  ActionVariant,
  ReceiptInfo,
  TxReceipt,
  TxResultRendering,
} from "lib/types";
import type { OperatorFunction } from "rxjs";

import { trackTxFailed, trackTxRejected } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import { catchError } from "rxjs";

const getReceiptInfo = (
  error: Error
): Pick<ReceiptInfo, "header" | "errorMsg"> =>
  error.message === "Request rejected"
    ? {
        header: "Rejected by user",
      }
    : {
        header: "Transaction failed",
        errorMsg: error.message,
      };

const getTxHashReceipts = (txHash?: string): TxReceipt[] =>
  txHash
    ? [
        {
          title: "Tx hash",
          value: txHash,
          html: <ExplorerLink openNewTab type="tx_hash" value={txHash} />,
        },
      ]
    : [];

const getActionVariant = (isRejected: boolean): ActionVariant =>
  isRejected ? "rejected" : "failed";

export const catchTxError = (
  onTxFailed?: () => void
): OperatorFunction<TxResultRendering, TxResultRendering> => {
  return catchError((error: Error) => {
    const txHash = error.message.match("(?:tx )(.*?)(?= at)")?.[1];
    if (error.message === "Request rejected") {
      trackTxRejected();
    } else {
      trackTxFailed();
    }
    onTxFailed?.();
    return Promise.resolve<TxResultRendering>({
      value: null,
      phase: TxStreamPhase.FAILED,
      receiptInfo: {
        ...getReceiptInfo(error),
        headerIcon: (
          <CustomIcon
            boxSize={5}
            color="error.light"
            name="alert-triangle-solid"
          />
        ),
      },
      receipts: getTxHashReceipts(txHash),
      actionVariant: getActionVariant(!txHash),
    });
  });
};
