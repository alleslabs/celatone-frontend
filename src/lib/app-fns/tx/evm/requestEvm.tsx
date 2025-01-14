import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { SignAndBroadcastEvm } from "lib/app-provider/hooks";
import { EstimatedEvmFeeRender } from "lib/components/EstimatedEvmFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxReceiptJsonRpc } from "lib/services/types";
import type { HexAddr, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { catchTxError, postEvmTx } from "../common";
import { sendingTx } from "../common/sending";

interface RequestEvmTxParams {
  to: HexAddr;
  data: string;
  fee: StdFee;
  signAndBroadcastEvm: SignAndBroadcastEvm;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const requestEvmTx = ({
  to,
  data,
  fee,
  signAndBroadcastEvm,
  onTxSucceed,
  onTxFailed,
}: RequestEvmTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postEvmTx<TxReceiptJsonRpc>({
      postFn: () => signAndBroadcastEvm({ to, data }),
    }),
    (txResult) => {
      onTxSucceed?.();
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Tx Hash",
            value: txResult.value.transactionHash,
            html: (
              <ExplorerLink
                type="tx_hash"
                value={txResult.value.transactionHash}
                openNewTab
              />
            ),
          },
          {
            title: "Tx Fee",
            html: (
              <EstimatedEvmFeeRender
                effectiveGasPrice={txResult.value.effectiveGasPrice}
                gasUsed={txResult.value.gasUsed}
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
