import type { SimulatedFeeEvm } from "lib/services/types";
import type { TxResultRendering } from "lib/types";

import { Spinner } from "@chakra-ui/react";
import { EstimatedFeeEvmRender } from "lib/components/EstimatedFeeEvmRender";
import { TxStreamPhase } from "lib/types";

export const sendingEvmTx = ({
  gasPrice,
  simulatedGasUsed,
}: SimulatedFeeEvm) => {
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
          html: (
            <EstimatedFeeEvmRender
              gasPrice={gasPrice}
              gasUsed={simulatedGasUsed}
              loading={false}
            />
          ),
          title: "Estimated tx fee",
        },
      ],
      value: null,
    } as TxResultRendering;
  };
};
