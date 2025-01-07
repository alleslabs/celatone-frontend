import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { SignAndBroadcast } from "lib/app-provider/hooks";
import type { BechAddr20, BechAddr32, TxResultRendering } from "lib/types";
import { findAttr } from "lib/utils";

import { catchTxError } from "./common";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface InstantiateTxParams {
  address: BechAddr20;
  fee: StdFee;
  label: string;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: (
    txInfo: DeliverTxResponse,
    contractLabel: string,
    contractAddress: BechAddr32
  ) => void;
  signAndBroadcast: SignAndBroadcast;
}

export const instantiateContractTx = ({
  address,
  fee,
  label,
  messages,
  onTxFailed,
  onTxSucceed,
  signAndBroadcast,
}: InstantiateTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      const contractAddress =
        findAttr(txInfo.events, "instantiate", "_contract_address") ?? "";

      onTxSucceed?.(txInfo, label, contractAddress as BechAddr32);
      // TODO: this is type hack
      return null as unknown as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
