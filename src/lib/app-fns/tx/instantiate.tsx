import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { BechAddr32, TxResultRendering } from "lib/types";
import { findAttr } from "lib/utils";

import { catchTxError } from "./common";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface InstantiateTxParams {
  address: string;
  messages: EncodeObject[];
  label: string;
  fee: StdFee;
  client: SigningCosmWasmClient;
  onTxSucceed?: (
    txInfo: DeliverTxResponse,
    contractLabel: string,
    contractAddress: BechAddr32
  ) => void;
  onTxFailed?: () => void;
}

export const instantiateContractTx = ({
  address,
  messages,
  label,
  fee,
  client,
  onTxSucceed,
  onTxFailed,
}: InstantiateTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => client.signAndBroadcast(address, messages, fee, ""),
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
