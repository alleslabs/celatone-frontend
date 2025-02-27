import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { SignAndBroadcast } from "lib/app-provider/hooks";
import type { BechAddr20, Option, TxResultRendering } from "lib/types";
import { findAttr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

export interface PublishTxInternalResult {
  txHash: string;
  txFee: Option<string>;
}

export type PublishSucceedCallback = (
  txResult: PublishTxInternalResult
) => void;

interface PublishModuleTxParams {
  address: BechAddr20;
  fee: StdFee;
  messages: EncodeObject[];
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed?: PublishSucceedCallback;
  onTxFailed?: () => void;
}

export const publishModuleTx = ({
  address,
  fee,
  messages,
  signAndBroadcast,
  onTxSucceed,
  onTxFailed,
}: PublishModuleTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => signAndBroadcast({ address, messages, fee }),
    }),
    ({ value: txInfo }) => {
      const txFee = findAttr(txInfo.events, "tx", "fee");
      onTxSucceed?.({ txHash: txInfo.transactionHash, txFee });
      return null as unknown as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
