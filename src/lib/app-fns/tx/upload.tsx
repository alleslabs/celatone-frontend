import type {
  SigningCosmWasmClient,
  UploadResult,
} from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { TxStreamPhase } from "lib/types";
import type { HumanAddr, TxResultRendering } from "lib/types";
import { formatUFee } from "lib/utils/formatter/denom";

import { catchTxError } from "./common/catchTxError";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface UploadTxParams {
  address: HumanAddr;
  codeDesc: string;
  wasmCode: Uint8Array;
  wasmFileName: string;
  fee: StdFee;
  memo?: string;
  client: SigningCosmWasmClient;
  onTxSucceed?: (codeId: number) => void;
  isMigrate: boolean;
}

export const uploadContractTx = ({
  address,
  codeDesc,
  wasmCode,
  wasmFileName,
  fee,
  memo,
  client,
  onTxSucceed,
  isMigrate,
}: UploadTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<UploadResult>({
      postFn: () => client.upload(address, wasmCode, fee, memo),
    }),
    ({ value: txInfo }) => {
      AmpTrack(AmpEvent.TX_SUCCEED);
      onTxSucceed?.(txInfo.codeId);
      const txFee = txInfo.events.find((e) => e.type === "tx")?.attributes[0]
        .value;
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Code ID",
            value: txInfo.codeId,
            html: (
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <ExplorerLink type="code_id" value={txInfo.codeId.toString()} />
              </div>
            ),
          },
          {
            title: "Tx Hash",
            value: txInfo.transactionHash,
            html: (
              <ExplorerLink type="tx_hash" value={txInfo.transactionHash} />
            ),
          },
          {
            title: "Tx Fee",
            value: txFee ? formatUFee(txFee) : "N/A",
          },
        ],
        receiptInfo: {
          header: "Upload Wasm Complete",
          description: (
            <>
              <span style={{ fontWeight: 700 }}>
                ‘{codeDesc || `${wasmFileName}(${txInfo.codeId})`}’
              </span>{" "}
              is has been uploaded. Would you like to{" "}
              {isMigrate ? "migrate" : "instantiate"} your code now?
            </>
          ),
          headerIcon: <CustomIcon name="upload-cloud" boxSize="5" />,
        },
        actionVariant: isMigrate ? "upload-migrate" : "upload",
      } as TxResultRendering;
    }
  )().pipe(catchTxError());
};
