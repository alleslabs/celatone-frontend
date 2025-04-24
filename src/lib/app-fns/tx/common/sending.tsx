import type { StdFee } from "@cosmjs/stargate";
import type { TxResultRendering } from "lib/types";

import { Spinner } from "@chakra-ui/react";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { TxStreamPhase } from "lib/types";

export const sendingTx = (fee: StdFee) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (_: void) => {
    return {
      actionVariant: "sending",
      phase: TxStreamPhase.BROADCAST,
      receiptInfo: {
        header: "Sending transaction",
        headerIcon: <Spinner size="md" />,
      },
      receipts: [
        {
          html: <EstimatedFeeRender estimatedFee={fee} loading={false} />,
          title: "Estimated tx fee",
        },
      ],
      value: null,
    } as TxResultRendering;
  };
};
