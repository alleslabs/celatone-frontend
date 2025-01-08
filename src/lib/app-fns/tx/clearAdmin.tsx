import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { SignAndBroadcast } from "lib/app-provider/hooks";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import type { BechAddr20, TxResultRendering } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError } from "./common";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface ClearAdminTxParams {
  address: BechAddr20;
  fee: StdFee;
  messages: EncodeObject[];
  onTxSucceed?: () => void;
  signAndBroadcast: SignAndBroadcast;
}

export const clearAdminTx = ({
  address,
  fee,
  messages,
  onTxSucceed,
  signAndBroadcast,
}: ClearAdminTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.();
      const txFee = findAttr(txInfo.events, "tx", "fee");
      return {
        phase: TxStreamPhase.SUCCEED,
        receiptInfo: {
          header: "Clear Admin Complete!",
          headerIcon: (
            <CustomIcon
              name="check-circle-solid"
              boxSize={5}
              color="success.main"
            />
          ),
        },
        receipts: [
          {
            html: (
              <ExplorerLink
                type="tx_hash"
                value={txInfo.transactionHash}
                openNewTab
              />
            ),
            title: "Tx Hash",
            value: txInfo.transactionHash,
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx Fee",
          },
        ],
        value: null,
      } as TxResultRendering;
    }
  )().pipe(catchTxError());
};
