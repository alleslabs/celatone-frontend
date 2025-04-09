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
  address,
  contractAddress,
  messages,
  action,
  fee,
  base64Message,
  signAndBroadcast,
  onTxSucceed,
  onTxFailed,
}: ExecuteTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, messages, fee }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.({
        type: "execute",
        action,
        sender: address,
        contractAddress,
        msg: base64Message,
        timestamp: getCurrentDate(),
      });

      const txFee = findAttr(txInfo.events, "tx", "fee");

      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Tx hash",
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
            title: "Tx fee",
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
          },
        ],
        receiptInfo: {
          header: "Transaction complete!",
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
