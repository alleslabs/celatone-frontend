import { Text } from "@chakra-ui/react";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { SignAndBroadcast } from "lib/app-provider/hooks";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { BechAddr20, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface ResendTxParams {
  address: BechAddr20;
  signAndBroadcast: SignAndBroadcast;
  fee: StdFee;
  messages: EncodeObject[];
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
}

export const resendTx = ({
  address,
  signAndBroadcast,
  fee,
  messages,
  onTxSucceed,
  onTxFailed,
}: ResendTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => signAndBroadcast({ address, messages, fee }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.(txInfo.transactionHash);
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
          header: "Transaction Complete!",
          description: (
            <Text fontWeight={700}>
              Your transaction was successfully resent.
            </Text>
          ),
          headerIcon: (
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize={5}
            />
          ),
        },
        actionVariant: "resend",
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
