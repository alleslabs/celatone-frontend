import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { findAttribute } from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { BechAddr20, Option, TxResultRendering } from "lib/types";

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
  client: SigningCosmWasmClient;
  onTxSucceed?: PublishSucceedCallback;
  onTxFailed?: () => void;
  fee: StdFee;
  messages: EncodeObject[];
}

export const publishModuleTx = ({
  address,
  client,
  onTxSucceed,
  onTxFailed,
  fee,
  messages,
}: PublishModuleTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => client.signAndBroadcast(address, messages, fee),
    }),
    ({ value: txInfo }) => {
      const txFee = findAttribute(txInfo.events, "tx", "fee")?.value;
      onTxSucceed?.({ txHash: txInfo.transactionHash, txFee });
      return null as unknown as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
