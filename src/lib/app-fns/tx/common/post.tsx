import type {
  DeliverTxResponse,
  ExecuteResult,
  InstantiateResult,
  UploadResult,
} from "@cosmjs/cosmwasm-stargate";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { formatUFee } from "lib/utils/formatter/denom";

type TxResult =
  | UploadResult
  | InstantiateResult
  | ExecuteResult
  | DeliverTxResponse;

interface PostTxParams<T extends TxResult> {
  postFn: () => Promise<T>;
}

export const postTx = <T extends TxResult>({ postFn }: PostTxParams<T>) => {
  return () =>
    postFn().then((txResult) => {
      return {
        value: txResult,
        phase: TxStreamPhase.BROADCAST,
        receipts: [
          {
            title: "Tx Hash",
            html: (
              <ExplorerLink type="tx_hash" value={txResult.transactionHash} />
            ),
          },
          {
            title: "Tx Fee",
            // TODO: Implement event/rawlog attribute picker
            value: `${formatUFee(
              txResult.events.find((e) => e.type === "tx")?.attributes[0]
                .value ?? "0"
            )}`,
          },
        ],
        receiptInfo: {
          header: "Sending Transaction",
        },
        actionVariant: "sending",
      } as TxResultRendering<T>;
    });
};
