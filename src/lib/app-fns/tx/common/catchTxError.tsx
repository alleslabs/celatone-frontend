import { Icon } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { IoIosWarning } from "react-icons/io";
import type { OperatorFunction } from "rxjs";
import { catchError } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { formatStdFee } from "lib/utils/formatter/denom";

export const catchTxError = (
  fee: StdFee,
  onTxFailed?: () => void
): OperatorFunction<TxResultRendering, TxResultRendering> => {
  return catchError((error: Error) => {
    const txHash = error.message.match("(?:tx )(.*?)(?= at)")?.at(1);

    onTxFailed?.();
    return Promise.resolve<TxResultRendering>(
      error.message === "Request rejected"
        ? {
            value: null,
            phase: TxStreamPhase.FAILED,
            receiptInfo: {
              header: "Request rejected",
              headerIcon: (
                <Icon as={IoIosWarning} fontSize="24px" color="error.light" />
              ),
            },
            receipts: [],
            actionVariant: "rejected",
          }
        : {
            value: null,
            phase: TxStreamPhase.FAILED,
            receiptInfo: {
              header: "Transaction Failed",
              description: error.message,
              headerIcon: (
                <Icon as={IoIosWarning} fontSize="24px" color="error.light" />
              ),
            },
            receipts: [
              {
                title: "Tx Hash",
                value: txHash,
                html: <ExplorerLink type="tx_hash" value={txHash ?? ""} />,
              },
              {
                title: "Tx Fee",
                value: formatStdFee(fee),
              },
            ],
            actionVariant: !txHash ? "rejected" : undefined,
          }
    );
  });
};
