import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import type { SignAndBroadcast } from "lib/app-provider/hooks";
import type { BechAddr20, Option, TxResultRendering } from "lib/types";
import type { Observable } from "rxjs";

import { pipe } from "@rx-stream/pipe";
import { findAttr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

export interface PublishTxInternalResult {
  txFee: Option<string>;
  txHash: string;
}

export type PublishSucceedCallback = (
  txResult: PublishTxInternalResult
) => void;

interface PublishModuleTxParams {
  address: BechAddr20;
  fee: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: PublishSucceedCallback;
  signAndBroadcast: SignAndBroadcast;
}

export const publishModuleTx = ({
  address,
  fee,
  messages,
  onTxFailed,
  onTxSucceed,
  signAndBroadcast,
}: PublishModuleTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      const txFee = findAttr(txInfo.events, "tx", "fee");
      onTxSucceed?.({ txFee, txHash: txInfo.transactionHash });
      return null as unknown as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
