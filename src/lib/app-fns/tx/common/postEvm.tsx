import { EstimatedFeeEvmRender } from "lib/components/EstimatedFeeEvmRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { TxReceiptJsonRpc } from "lib/services/types";
import type { TxResultRendering } from "lib/types";
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
        value: txResult,
        phase: TxStreamPhase.BROADCAST,
        receipts: [
          {
            title: "Tx Hash",
            html: (
              <ExplorerLink
                type="evm_tx_hash"
                value={txResult.transactionHash}
                openNewTab
              />
            ),
          },
          {
            title: "Tx Fee",
            // TODO: Implement event/rawlog attribute picker
            html: (
              <EstimatedFeeEvmRender
                gasPrice={txResult.effectiveGasPrice}
                gasUsed={txResult.gasUsed}
                loading={false}
              />
            ),
          },
        ],
        receiptInfo: {
          header: "Sending Transaction",
        },
        actionVariant: "sending",
      } as TxResultRendering<T>;
    });
};
