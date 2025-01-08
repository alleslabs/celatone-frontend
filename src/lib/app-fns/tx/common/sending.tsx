import { Spinner } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";

export const sendingTx = (fee: StdFee) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (_: void) => {
    return {
      actionVariant: "sending",
      phase: TxStreamPhase.BROADCAST,
      receiptInfo: {
        header: "Sending Transaction",
        headerIcon: <Spinner size="md" />,
      },
      receipts: [
        {
          html: <EstimatedFeeRender estimatedFee={fee} loading={false} />,
          title: "Estimated Tx Fee",
        },
      ],
      value: null,
    } as TxResultRendering;
  };
};
