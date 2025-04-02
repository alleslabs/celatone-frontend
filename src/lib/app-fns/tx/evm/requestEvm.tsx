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
            title: "Tx Hash",
            value: txResult.value.transactionHash,
            html: (
              <ExplorerLink
                openNewTab
                type="evm_tx_hash"
                value={txResult.value.transactionHash}
              />
            ),
          },
          {
            title: "Tx Fee",
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
          header: "Transaction Complete!",
          headerIcon: (
            <CustomIcon
              boxSize={5}
              color="success.main"
              name="check-circle-solid"
            />
          ),
        },
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
