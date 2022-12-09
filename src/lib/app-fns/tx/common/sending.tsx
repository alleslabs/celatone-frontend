import { Spinner } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";

import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { formatStdFee } from "lib/utils/formatter/denom";

export const sendingTx = (fee: StdFee) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (_: void) => {
    return {
      value: null,
      phase: TxStreamPhase.BROADCAST,
      receipts: [
        {
          title: "Tx Fee",
          value: formatStdFee(fee),
        },
      ],
      receiptInfo: {
        header: "Sending Transaction",
        headerIcon: <Spinner size="md" color="gray.400" />,
      },
      actionVariant: "sending",
    } as TxResultRendering;
  };
};
