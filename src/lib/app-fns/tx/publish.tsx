import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { PublishSucceedCallback } from "lib/app-provider/tx/publish";
import type { HumanAddr, TxResultRendering } from "lib/types";

import { catchTxError, postTx, sendingTx } from "./common";

interface PublishModuleTxParams {
  address: HumanAddr;
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
      const txFee = txInfo.events.find((e) => e.type === "tx")?.attributes[0]
        .value;
      onTxSucceed?.({ txHash: txInfo.transactionHash, txFee });
      return null as unknown as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
