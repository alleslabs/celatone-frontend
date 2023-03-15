import type { OperatorFunction } from "rxjs";
import { catchError } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";

const getReceiptInfo = (error: Error) =>
  error.message === "Request rejected"
    ? {
        header: "Rejected by user",
      }
    : {
        header: "Transaction Failed",
        description: error.message,
      };

const getTxHashReceipt = (txHash?: string) =>
  txHash
    ? [
        {
          title: "Tx Hash",
          value: txHash,
          html: <ExplorerLink type="tx_hash" value={txHash} />,
        },
      ]
    : [];

const getActionVariant = (isRejected: boolean) =>
  isRejected ? "rejected" : undefined;

export const catchTxError = (
  onTxFailed?: () => void
): OperatorFunction<TxResultRendering, TxResultRendering> => {
  return catchError((error: Error) => {
    const txHash = error.message.match("(?:tx )(.*?)(?= at)")?.at(1);

    AmpTrack(
      error.message === "Request rejected"
        ? AmpEvent.TX_REJECTED
        : AmpEvent.TX_FAILED
    );
    onTxFailed?.();
    return Promise.resolve<TxResultRendering>({
      value: null,
      phase: TxStreamPhase.FAILED,
      receiptInfo: {
        ...getReceiptInfo(error),
        headerIcon: (
          <CustomIcon
            name="alert-circle-solid"
            color="error.light"
            boxSize="5"
          />
        ),
      },
      receipts: getTxHashReceipt(txHash),
      actionVariant: getActionVariant(!txHash),
    });
  });
};
