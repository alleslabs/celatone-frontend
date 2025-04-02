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
  messages: EncodeObject[];
  fee: StdFee;
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
}

export const migrateContractTx = ({
  address,
  messages,
  fee,
  signAndBroadcast,
  onTxSucceed,
  onTxFailed,
}: MigrateTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, messages, fee }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.(txInfo.transactionHash);
      const txFee = findAttr(txInfo.events, "tx", "fee");
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Tx Hash",
            value: txInfo.transactionHash,
            html: (
              <ExplorerLink
                openNewTab
                type="tx_hash"
                value={txInfo.transactionHash}
              />
            ),
          },
          {
            title: "Tx Fee",
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
          },
        ],
        receiptInfo: {
          header: "Migration Complete!",
          headerIcon: (
            <CustomIcon color="success.main" name="check-circle-solid" />
          ),
        },
        actionVariant: "migrate",
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
