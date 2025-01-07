import type {
  DeliverTxResponse,
  ExecuteResult,
  InstantiateResult,
  UploadResult,
} from "@cosmjs/cosmwasm-stargate";
import { isDeliverTxFailure } from "@cosmjs/stargate";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr } from "lib/utils";

interface PostTxParams<T extends TxResult> {
  postFn: () => Promise<T>;
}

// TODO: We'll use only DeliverTxResponse later.
type TxResult =
  | DeliverTxResponse
  | ExecuteResult
  | InstantiateResult
  | UploadResult;

// TODO: remove later. We'll throw an error with transactionHash.
function createDeliverTxResponseErrorMessage(
  result: DeliverTxResponse
): string {
  return `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`;
}

export const postTx = <T extends TxResult>({ postFn }: PostTxParams<T>) => {
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
            header: "Sending Transaction",
          },
          receipts: [
            {
              html: (
                <ExplorerLink
                  type="tx_hash"
                  value={txResult.transactionHash}
                  openNewTab
                />
              ),
              title: "Tx Hash",
            },
            {
              // TODO: Implement event/rawlog attribute picker
              html: (
                <EstimatedFeeRender
                  estimatedFee={feeFromStr(txFee)}
                  loading={false}
                />
              ),
              title: "Tx Fee",
            },
          ],
          value: txResult,
        } as TxResultRendering<T>;
      }
    );
};
