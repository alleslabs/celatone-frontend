import type { SignAndBroadcastEvm } from "lib/app-provider/hooks";
import type { SimulatedFeeEvm, TxReceiptJsonRpc } from "lib/services/types";
import type { HexAddr, TxResultRendering } from "lib/types";
import type { Observable } from "rxjs";

import { pipe } from "@rx-stream/pipe";
import { toBeHex } from "ethers";
import { EstimatedFeeEvmRender } from "lib/components/EstimatedFeeEvmRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";

import { catchTxError, postEvmTx } from "../common";
import { sendingEvmTx } from "../common/sendingEvm";

interface RequestEvmTxParams {
  data: string;
  estimatedFee: SimulatedFeeEvm;
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
  signAndBroadcastEvm: SignAndBroadcastEvm;
  to: HexAddr;
  value: string;
}

export const requestEvmTx = ({
  data,
  estimatedFee,
  onTxFailed,
  onTxSucceed,
  signAndBroadcastEvm,
  to,
  value,
}: RequestEvmTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingEvmTx(estimatedFee),
    postEvmTx<TxReceiptJsonRpc>({
      postFn: () =>
        signAndBroadcastEvm({
          data,
          to,
          value: value ? toBeHex(value) : null,
        }),
    }),
    (txResult) => {
      onTxSucceed?.();
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
                type="evm_tx_hash"
                value={txResult.value.transactionHash}
              />
            ),
            title: "Tx hash",
            value: txResult.value.transactionHash,
          },
          {
            html: (
              <EstimatedFeeEvmRender
                gasPrice={txResult.value.effectiveGasPrice}
                gasUsed={txResult.value.gasUsed}
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
