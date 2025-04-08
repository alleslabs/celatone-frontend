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

interface ClearAdminTxParams {
  address: BechAddr20;
  messages: EncodeObject[];
  fee: StdFee;
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed?: () => void;
}

export const clearAdminTx = ({
  address,
  messages,
  fee,
  signAndBroadcast,
  onTxSucceed,
}: ClearAdminTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, messages, fee }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.();
      const txFee = findAttr(txInfo.events, "tx", "fee");
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Tx hash",
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
            title: "Tx fee",
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
          },
        ],
        receiptInfo: {
          header: "Clear admin complete!",
          headerIcon: (
            <CustomIcon
              boxSize={5}
              color="success.main"
              name="check-circle-solid"
            />
          ),
        },
      } as TxResultRendering;
    }
  )().pipe(catchTxError());
};
