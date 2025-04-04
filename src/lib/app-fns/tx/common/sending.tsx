import { Spinner } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";

export const sendingTx = (fee: StdFee) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (_: void) => {
    return {
      value: null,
      phase: TxStreamPhase.BROADCAST,
      receipts: [
        {
          title: "Estimated tx fee",
          html: <EstimatedFeeRender estimatedFee={fee} loading={false} />,
        },
      ],
      receiptInfo: {
        header: "Sending transaction",
        headerIcon: <Spinner size="md" />,
      },
      actionVariant: "sending",
    } as TxResultRendering;
  };
};
