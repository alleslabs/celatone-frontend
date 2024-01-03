import type {
  MigrateResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { BechAddr20, BechAddr32, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr } from "lib/utils";

import { catchTxError } from "./common";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface MigrateTxParams {
  sender: BechAddr20;
  contractAddress: BechAddr32;
  codeId: number;
  migrateMsg: object;
  fee: StdFee;
  client: SigningCosmWasmClient;
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
}

export const migrateContractTx = ({
  sender,
  contractAddress,
  codeId,
  migrateMsg,
  fee,
  client,
  onTxSucceed,
  onTxFailed,
}: MigrateTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<MigrateResult>({
      postFn: () =>
        client.migrate(
          sender,
          contractAddress,
          codeId,
          migrateMsg,
          fee,
          undefined
        ),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.(txInfo.transactionHash);
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
          header: "Migration Complete!",
          headerIcon: (
            <CustomIcon name="check-circle-solid" color="success.main" />
          ),
        },
        actionVariant: "migrate",
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
