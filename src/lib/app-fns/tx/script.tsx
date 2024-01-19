import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { BechAddr20, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface DeployScriptTxParams {
  address: BechAddr20;
  client: SigningCosmWasmClient;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
  fee: StdFee;
  messages: EncodeObject[];
}

export const deployScriptTx = ({
  address,
  client,
  onTxSucceed,
  onTxFailed,
  fee,
  messages,
}: DeployScriptTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => client.signAndBroadcast(address, messages, fee),
    }),
    ({ value: txInfo }) => {
      const txFee = txInfo.events.find((e) => e.type === "tx")?.attributes[0]
        .value;
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
                type="tx_hash"
                value={txInfo.transactionHash}
                openNewTab
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
