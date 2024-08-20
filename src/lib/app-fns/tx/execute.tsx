import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { findAttribute } from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { EncodeObject } from "@initia/utils";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { Activity } from "lib/stores/contract";
import type { BechAddr20, BechAddr32, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, getCurrentDate } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface ExecuteTxParams {
  address: BechAddr20;
  messages: EncodeObject[];
  fee: StdFee;
  base64Message: string;
  client: SigningCosmWasmClient;
  onTxSucceed?: (activity: Activity) => void;
  onTxFailed?: () => void;
}

export const executeContractTx = ({
  address,
  messages,
  fee,
  base64Message,
  client,
  onTxSucceed,
  onTxFailed,
}: ExecuteTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => client.signAndBroadcast(address, messages, fee, ""),
    }),
    ({ value: txInfo }) => {
      const contractAddress = findAttribute(
        txInfo.events,
        "execute",
        "_contract_address"
      )?.value;

      const action = findAttribute(txInfo.events, "wasm", "action")?.value;

      onTxSucceed?.({
        type: "execute",
        action,
        sender: address,
        contractAddress: contractAddress as BechAddr32,
        msg: base64Message,
        timestamp: getCurrentDate(),
      });

      const txFee = findAttribute(txInfo.events, "tx", "fee")?.value;

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
