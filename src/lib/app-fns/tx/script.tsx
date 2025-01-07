import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { SignAndBroadcast } from "lib/app-provider/hooks";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { BechAddr20, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface DeployScriptTxParams {
  address: BechAddr20;
  fee: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
  signAndBroadcast: SignAndBroadcast;
}

export const deployScriptTx = ({
  address,
  fee,
  messages,
  onTxFailed,
  onTxSucceed,
  signAndBroadcast,
}: DeployScriptTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      const txFee = findAttr(txInfo.events, "tx", "fee");

      onTxSucceed?.();
      return {
        phase: TxStreamPhase.SUCCEED,
        receiptInfo: {
          header: "Script Deployed!",
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
  )().pipe(catchTxError(onTxFailed));
};
