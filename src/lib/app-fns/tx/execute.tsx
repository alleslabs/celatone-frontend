import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { SignAndBroadcast } from "lib/app-provider/hooks";
import type { Activity } from "lib/stores/contract";
import type { BechAddr20, BechAddr32, TxResultRendering } from "lib/types";
import type { Observable } from "rxjs";

import { pipe } from "@rx-stream/pipe";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr, getCurrentDate } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface ExecuteTxParams {
  address: BechAddr20;
  contractAddress: BechAddr32;
  messages: EncodeObject[];
  action: string;
  fee: StdFee;
  base64Message: string;
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed?: (activity: Activity) => void;
  onTxFailed?: () => void;
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
          header: "Transaction complete!",
          headerIcon: (
            <CustomIcon
              boxSize={5}
              color="success.main"
              name="check-circle-solid"
            />
          ),
        },
        receipts: [
          {
            html: (
              <ExplorerLink
                openNewTab
                type="tx_hash"
                value={txInfo.transactionHash}
              />
            ),
            title: "Tx hash",
            value: txInfo.transactionHash,
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx fee",
          },
        ],
        value: null,
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
