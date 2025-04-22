import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { SignAndBroadcast } from "lib/app-provider/hooks";
import type { BechAddr20, TxResultRendering } from "lib/types";
import type { Observable } from "rxjs";

import { pipe } from "@rx-stream/pipe";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError } from "./common";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface MigrateTxParams {
  address: BechAddr20;
  fee: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: (txHash: string) => void;
  signAndBroadcast: SignAndBroadcast;
}

export const migrateContractTx = ({
  address,
  fee,
  messages,
  onTxFailed,
  onTxSucceed,
  signAndBroadcast,
}: MigrateTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.(txInfo.transactionHash);
      const txFee = findAttr(txInfo.events, "tx", "fee");
      return {
        actionVariant: "migrate",
        phase: TxStreamPhase.SUCCEED,
        receiptInfo: {
          header: "Migration complete!",
          headerIcon: (
            <CustomIcon color="success.main" name="check-circle-solid" />
          ),
        },
        receipts: [
          {
            html: (
              <ExplorerLink
                openNewTab
                type="tx_hash"
                value={txInfo.transactionHash}
              />
            ),
            title: "Tx hash",
            value: txInfo.transactionHash,
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx fee",
          },
        ],
        value: null,
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
