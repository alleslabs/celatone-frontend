import type {
  InstantiateResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { CatchTxError } from "lib/app-provider/tx/catchTxError";
import type { TxResultRendering } from "lib/types";

import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface InstantiateTxParams {
  address: string;
  codeId: number;
  initMsg: object;
  label: string;
  fee: StdFee;
  admin: string;
  funds: Coin[];
  client: SigningCosmWasmClient;
  catchTxError: CatchTxError;
  onTxSucceed?: (txInfo: InstantiateResult, contractLabel: string) => void;
  onTxFailed?: () => void;
}

export const instantiateContractTx = ({
  address,
  codeId,
  initMsg,
  label,
  fee,
  admin,
  funds,
  client,
  catchTxError,
  onTxSucceed,
  onTxFailed,
}: InstantiateTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<InstantiateResult>({
      postFn: () =>
        client.instantiate(address, codeId, initMsg, label, fee, {
          admin,
          funds,
        }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.(txInfo, label);
      // TODO: this is type hack
      return null as unknown as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
