import type { DeliverTxResponse } from "@cosmjs/cosmwasm-stargate";
import type { TxResultRendering } from "lib/types";

import { isDeliverTxFailure } from "@cosmjs/stargate";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TxStreamPhase } from "lib/types";
import { feeFromStr } from "lib/utils";

interface PostTxParams<T extends DeliverTxResponse> {
  postFn: () => Promise<T>;
}

// TODO: remove later. We'll throw an error with transactionHash.
function createDeliverTxResponseErrorMessage(
  result: DeliverTxResponse
): string {
  return `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`;
}

export const postTx = <T extends DeliverTxResponse>({
  postFn,
}: PostTxParams<T>) => {
  return () =>
    postFn().then(
      // NOTE: only shown if there is a wait for the next step
      // currently not appearing since next step is already a success
      (txResult) => {
        if ("code" in txResult && isDeliverTxFailure(txResult)) {
          throw new Error(createDeliverTxResponseErrorMessage(txResult));
        }
        const txFee = txResult.events.find((e) => e.type === "tx")
          ?.attributes[0].value;

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
                  type="tx_hash"
                  value={txResult.transactionHash}
                />
              ),
              title: "Tx hash",
            },
            {
              // TODO: Implement event/rawlog attribute picker
              html: (
                <EstimatedFeeRender
                  estimatedFee={feeFromStr(txFee)}
                  loading={false}
                />
              ),
              title: "Tx fee",
            },
          ],
          value: txResult,
        } as TxResultRendering<T>;
      }
    );
};
