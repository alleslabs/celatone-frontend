import type { TxReceiptJsonRpc } from "lib/services/types";
import type { TxResultRendering } from "lib/types";

import { EstimatedFeeEvmRender } from "lib/components/EstimatedFeeEvmRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TxStreamPhase } from "lib/types";

interface PostEvmTxParams<T extends TxReceiptJsonRpc> {
  postFn: () => Promise<T>;
}

export const postEvmTx = <T extends TxReceiptJsonRpc>({
  postFn,
}: PostEvmTxParams<T>) => {
  return () =>
    postFn().then((txResult) => {
      return {
        actionVariant: "sending",
        phase: TxStreamPhase.BROADCAST,
        receiptInfo: {
          header: "Sending transaction",
        },
        receipts: [
          {
            html: (
              <ExplorerLink
                openNewTab
                type="evm_tx_hash"
                value={txResult.transactionHash}
              />
            ),
            title: "Tx hash",
          },
          {
            // TODO: Implement event/rawlog attribute picker
            html: (
              <EstimatedFeeEvmRender
                gasPrice={txResult.effectiveGasPrice}
                gasUsed={txResult.gasUsed}
                loading={false}
              />
            ),
            title: "Tx fee",
          },
        ],
        value: txResult,
      } as TxResultRendering<T>;
    });
};
