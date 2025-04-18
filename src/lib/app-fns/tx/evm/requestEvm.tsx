import { pipe } from "@rx-stream/pipe";
import { toBeHex } from "ethers";
import type { Observable } from "rxjs";

import type { SignAndBroadcastEvm } from "lib/app-provider/hooks";
import { EstimatedFeeEvmRender } from "lib/components/EstimatedFeeEvmRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { SimulatedFeeEvm, TxReceiptJsonRpc } from "lib/services/types";
import type { HexAddr, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { catchTxError, postEvmTx } from "../common";
import { sendingEvmTx } from "../common/sendingEvm";

interface RequestEvmTxParams {
  to: HexAddr;
  data: string;
  value: string;
  estimatedFee: SimulatedFeeEvm;
  signAndBroadcastEvm: SignAndBroadcastEvm;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const requestEvmTx = ({
  to,
  data,
  value,
  estimatedFee,
  signAndBroadcastEvm,
  onTxSucceed,
  onTxFailed,
}: RequestEvmTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingEvmTx(estimatedFee),
    postEvmTx<TxReceiptJsonRpc>({
      postFn: () =>
        signAndBroadcastEvm({
          to,
          data,
          value: value ? toBeHex(value) : null,
        }),
    }),
    (txResult) => {
      onTxSucceed?.();
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Tx hash",
            value: txResult.value.transactionHash,
            html: (
              <ExplorerLink
                type="evm_tx_hash"
                value={txResult.value.transactionHash}
                openNewTab
              />
            ),
          },
          {
            title: "Tx fee",
            html: (
              <EstimatedFeeEvmRender
                gasPrice={txResult.value.effectiveGasPrice}
                gasUsed={txResult.value.gasUsed}
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
