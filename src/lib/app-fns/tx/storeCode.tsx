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

export interface StoreCodeTxInternalResult {
  codeDisplayName: string;
  codeId: string;
  codeHash: Option<string>;
  txHash: string;
  txFee: Option<string>;
}

export type StoreCodeSucceedCallback = (
  txResult: StoreCodeTxInternalResult
) => void;

interface StoreCodeTxParams {
  address: BechAddr20;
  codeName: string;
  messages: ComposedMsg[];
  wasmFileName: string;
  fee: StdFee;
  isMigrate: boolean;
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed: StoreCodeSucceedCallback;
}

export const storeCodeTx = ({
  address,
  codeName,
  messages,
  wasmFileName,
  fee,
  isMigrate,
  signAndBroadcast,
  onTxSucceed,
}: StoreCodeTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<DeliverTxResponse>({
      postFn: () => signAndBroadcast({ address, messages, fee }),
    }),
    ({ value: txInfo }) => {
      const codeId = findAttr(txInfo.events, "store_code", "code_id") ?? "0";
      const codeHash = findAttr(txInfo.events, "store_code", "code_checksum");
      const txFee = findAttr(txInfo.events, "tx", "fee");

      onTxSucceed({
        codeId: parseInt(codeId, 10).toString(),
        codeHash,
        codeDisplayName: codeName || `${wasmFileName}(${codeId})`,
        txHash: txInfo.transactionHash,
        txFee,
      });

      return isMigrate
        ? ({
            value: null,
            phase: TxStreamPhase.SUCCEED,
            receipts: [
              {
                title: "Code ID",
                value: codeId,
                html: (
                  <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <ExplorerLink type="code_id" value={codeId} openNewTab />
                  </div>
                ),
              },
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
              header: "Upload Wasm Complete!",
              description: (
                <>
                  <span style={{ fontWeight: 700 }}>
                    ‘{codeName || `${wasmFileName}(${codeId})`}’
                  </span>{" "}
                  is has been uploaded. Would you like to migrate your code now?
                </>
              ),
              headerIcon: (
                <CustomIcon name="upload-cloud" boxSize={5} color="gray.600" />
              ),
            },
            actionVariant: "upload-migrate",
          } as TxResultRendering)
        : // TODO: this is type hack
          (null as unknown as TxResultRendering);
    }
  )().pipe(catchTxError());
};
