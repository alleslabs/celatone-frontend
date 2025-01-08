import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import type { SignAndBroadcast } from "lib/app-provider/hooks";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type {
  BechAddr20,
  ComposedMsg,
  Option,
  TxResultRendering,
} from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError } from "./common";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

export type StoreCodeSucceedCallback = (
  txResult: StoreCodeTxInternalResult
) => void;

export interface StoreCodeTxInternalResult {
  codeDisplayName: string;
  codeHash: Option<string>;
  codeId: string;
  txFee: Option<string>;
  txHash: string;
}

interface StoreCodeTxParams {
  address: BechAddr20;
  codeName: string;
  fee: StdFee;
  isMigrate: boolean;
  messages: ComposedMsg[];
  onTxSucceed: StoreCodeSucceedCallback;
  signAndBroadcast: SignAndBroadcast;
  wasmFileName: string;
}

export const storeCodeTx = ({
  address,
  codeName,
  fee,
  isMigrate,
  messages,
  onTxSucceed,
  signAndBroadcast,
  wasmFileName,
}: StoreCodeTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      const codeId = findAttr(txInfo.events, "store_code", "code_id") ?? "0";
      const codeHash = findAttr(txInfo.events, "store_code", "code_checksum");
      const txFee = findAttr(txInfo.events, "tx", "fee");

      onTxSucceed({
        codeDisplayName: codeName || `${wasmFileName}(${codeId})`,
        codeHash,
        codeId: parseInt(codeId, 10).toString(),
        txFee,
        txHash: txInfo.transactionHash,
      });

      return isMigrate
        ? ({
            actionVariant: "upload-migrate",
            phase: TxStreamPhase.SUCCEED,
            receiptInfo: {
              description: (
                <>
                  <span style={{ fontWeight: 700 }}>
                    ‘{codeName || `${wasmFileName}(${codeId})`}’
                  </span>{" "}
                  is has been uploaded. Would you like to migrate your code now?
                </>
              ),
              header: "Upload Wasm Complete!",
              headerIcon: (
                <CustomIcon name="upload-cloud" boxSize={5} color="gray.600" />
              ),
            },
            receipts: [
              {
                html: (
                  <div style={{ alignItems: "center", display: "inline-flex" }}>
                    <ExplorerLink type="code_id" value={codeId} openNewTab />
                  </div>
                ),
                title: "Code ID",
                value: codeId,
              },
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
          } as TxResultRendering)
        : // TODO: this is type hack
          (null as unknown as TxResultRendering);
    }
  )().pipe(catchTxError());
};
