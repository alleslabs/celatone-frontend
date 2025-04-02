import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import type { SignAndBroadcast } from "lib/app-provider/hooks";
import type { BechAddr20, TxResultRendering } from "lib/types";
import type { Observable } from "rxjs";

import { pipe } from "@rx-stream/pipe";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface DeployScriptTxParams {
  address: BechAddr20;
  fee: StdFee;
  messages: EncodeObject[];
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const deployScriptTx = ({
  address,
  fee,
  messages,
  signAndBroadcast,
  onTxSucceed,
  onTxFailed,
}: DeployScriptTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => signAndBroadcast({ address, messages, fee }),
    }),
    ({ value: txInfo }) => {
      const txFee = findAttr(txInfo.events, "tx", "fee");

      onTxSucceed?.();
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
          header: "Script Deployed!",
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
  )().pipe(catchTxError(onTxFailed));
};
