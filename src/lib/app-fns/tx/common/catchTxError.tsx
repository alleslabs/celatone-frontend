import { Icon } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { IoIosWarning } from "react-icons/io";
import type { OperatorFunction } from "rxjs";
import { catchError } from "rxjs";

import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { formatStdFee } from "lib/utils/formatter/denom";

const getErrorResult = (error: Error, fee: StdFee): TxResultRendering => {
  if (error.message === "Request rejected") {
    return {
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
    };
  }
  return {
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
        title: "Tx Fee",
        value: formatStdFee(fee),
      },
    ],
  };
};

export const catchTxError = (
  fee: StdFee,
  onTxFailed?: () => void
): OperatorFunction<TxResultRendering, TxResultRendering> => {
  // TODO: Figure out how to get txHash
  return catchError((error) => {
    onTxFailed?.();
    return Promise.resolve<TxResultRendering>(getErrorResult(error, fee));
  });
};
