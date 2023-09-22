import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { postTx } from "../common/post";
import { sendingTx } from "../common/sending";
import type { CatchTxError } from "lib/app-provider/tx/catchTxError";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import type { HumanAddr, TxResultRendering } from "lib/types";
import { formatUFee } from "lib/utils/formatter/denom";

interface ExecuteModuleTxParams {
  address: HumanAddr;
  messages: EncodeObject[];
  fee: StdFee;
  client: SigningCosmWasmClient;
  catchTxError: CatchTxError;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const executeModuleTx = ({
  address,
  messages,
  fee,
  client,
  catchTxError,
  onTxSucceed,
  onTxFailed,
}: ExecuteModuleTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => client.signAndBroadcast(address, messages, fee),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.();
      const txFee = txInfo.events.find((e) => e.type === "tx")?.attributes[0]
        .value;
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Tx Hash",
            value: txInfo.transactionHash,
            html: (
              <ExplorerLink
                type="tx_hash"
                value={txInfo.transactionHash}
                openNewTab
              />
            ),
          },
          {
            title: "Tx Fee",
            value: txFee ? formatUFee(txFee) : "N/A",
          },
        ],
        receiptInfo: {
          header: "Transaction Complete!",
          headerIcon: (
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize={5}
            />
          ),
        },
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
