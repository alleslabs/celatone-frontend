import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { EncodeObject } from "@initia/utils";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { BechAddr20, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface UpdateAdminTxParams {
  address: BechAddr20;
  messages: EncodeObject[];
  fee: StdFee;
  client: SigningCosmWasmClient;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const updateAdminTx = ({
  address,
  messages,
  fee,
  client,
  onTxSucceed,
  onTxFailed,
}: UpdateAdminTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => client.signAndBroadcast(address, messages, fee, ""),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.();
      const txFee = findAttr(txInfo.events, "tx", "fee");

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
          header: "Update Admin Complete!",
          headerIcon: (
            <CustomIcon name="check-circle-solid" color="success.main" />
          ),
        },
        actionVariant: "update-admin",
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
