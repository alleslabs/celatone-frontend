import { Icon } from "@chakra-ui/react";
import type {
  SigningCosmWasmClient,
  UploadResult,
} from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import { MdCloudUpload } from "react-icons/md";
import type { Observable } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TxStreamPhase } from "lib/types";
import type { TxResultRendering } from "lib/types";
import { formatUFee } from "lib/utils/formatter/denom";

import { catchTxError } from "./common/catchTxError";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface UploadTxParams {
  address: string;
  codeDesc: string;
  wasmCode: Uint8Array;
  wasmFileName: string;
  fee: StdFee;
  memo?: string;
  client: SigningCosmWasmClient;
  onTxSucceed?: (codeId: number) => void;
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
}: UploadTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<UploadResult>({
      postFn: () => client.upload(address, wasmCode, fee, memo),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.(txInfo.codeId);
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Code ID",
            value: txInfo.codeId,
            html: (
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <ExplorerLink value={txInfo.codeId.toString()} />
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
            value: `${formatUFee(
              txInfo.events.find((e) => e.type === "tx")?.attributes[0].value ??
                "0u"
            )}`,
          },
        ],
        receiptInfo: {
          header: "Upload WASM Complete",
          description: (
            <>
              <span style={{ fontWeight: 700 }}>
                ‘{codeDesc || `${wasmFileName}(${txInfo.codeId})`}’
              </span>{" "}
              is available on your stored code. Would you like to instantiate
              your code now?
            </>
          ),
          headerIcon: (
            <Icon as={MdCloudUpload} fontSize="24px" color="text.dark" />
          ),
        },
        actionVariant: "upload",
      } as TxResultRendering;
    }
  )().pipe(catchTxError());
};
