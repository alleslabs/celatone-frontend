import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { SignAndBroadcast } from "lib/app-provider/hooks";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { Activity } from "lib/stores/contract";
import type { BechAddr20, BechAddr32, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr, getCurrentDate } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface ExecuteTxParams {
  action: string;
  address: BechAddr20;
  base64Message: string;
  contractAddress: BechAddr32;
  fee: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: (activity: Activity) => void;
  signAndBroadcast: SignAndBroadcast;
}

export const executeContractTx = ({
  action,
  address,
  base64Message,
  contractAddress,
  fee,
  messages,
  onTxFailed,
  onTxSucceed,
  signAndBroadcast,
}: ExecuteTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.({
        action,
        contractAddress,
        msg: base64Message,
        sender: address,
        timestamp: getCurrentDate(),
        type: "execute",
      });

      const txFee = findAttr(txInfo.events, "tx", "fee");

      return {
        phase: TxStreamPhase.SUCCEED,
        receiptInfo: {
          header: "Transaction Complete!",
          headerIcon: (
            <CustomIcon
              name="check-circle-solid"
              boxSize={5}
              color="success.main"
            />
          ),
        },
        receipts: [
          {
            html: (
              <ExplorerLink
                type="tx_hash"
                value={txInfo.transactionHash}
                openNewTab
              />
            ),
            title: "Tx Hash",
            value: txInfo.transactionHash,
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx Fee",
          },
        ],
        value: null,
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
