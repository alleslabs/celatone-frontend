import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { SignAndBroadcast } from "lib/app-provider/hooks";
import type { BechAddr20, BechAddr32, TxResultRendering } from "lib/types";
import type { Observable } from "rxjs";

import { pipe } from "@rx-stream/pipe";
import { findAttr } from "lib/utils";

import { catchTxError } from "./common";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface InstantiateTxParams {
  address: BechAddr20;
  messages: EncodeObject[];
  label: string;
  fee: StdFee;
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed?: (
    txInfo: DeliverTxResponse,
    contractLabel: string,
    contractAddress: BechAddr32
  ) => void;
  onTxFailed?: () => void;
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
