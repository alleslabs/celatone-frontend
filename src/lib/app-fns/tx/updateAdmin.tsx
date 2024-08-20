import type {
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  TxResultRendering,
} from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface UpdateAdminTxParams {
  address: BechAddr20;
  contractAddress: BechAddr32;
  newAdmin: BechAddr;
  fee: StdFee;
  client: SigningCosmWasmClient;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

// public async updateAdmin(
//   senderAddress: string,
//   contractAddress: string,
//   newAdmin: string,
//   fee: StdFee | "auto" | number,
//   memo = "",
// ): Promise<ChangeAdminResult> {
//   const updateAdminMsg: MsgUpdateAdminEncodeObject = {
//     typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
//     value: MsgUpdateAdmin.fromPartial({
//       sender: senderAddress,
//       contract: contractAddress,
//       newAdmin: newAdmin,
//     }),
//   };
//   const result = await this.signAndBroadcast(senderAddress, [updateAdminMsg], fee, memo);
//   if (isDeliverTxFailure(result)) {
//     throw new Error(createDeliverTxResponseErrorMessage(result));
//   }
//   return {
//     logs: logs.parseRawLog(result.rawLog),
//     height: result.height,
//     transactionHash: result.transactionHash,
//     events: result.events,
//     gasWanted: result.gasWanted,
//     gasUsed: result.gasUsed,
//   };
// }

export const updateAdminTx = ({
  address,
  contractAddress,
  newAdmin,
  fee,
  client,
  onTxSucceed,
  onTxFailed,
}: UpdateAdminTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<ExecuteResult>({
      postFn: () =>
        client.updateAdmin(address, contractAddress, newAdmin, fee, undefined),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.();
      const txFee = txInfo.events.find((e) => e.type === "tx")?.attributes[0]
        .value;
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
