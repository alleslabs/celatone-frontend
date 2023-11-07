import type {
  SigningCosmWasmClient,
  ChangeAdminResult,
} from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import type { TxResultRendering, ContractAddr, HumanAddr } from "lib/types";
import { formatUFee } from "lib/utils";

import { catchTxError } from "./common";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface ClearAdminTxParams {
  address: HumanAddr;
  contractAddress: ContractAddr;
  fee: StdFee;
  memo?: string;
  client: SigningCosmWasmClient;
  onTxSucceed?: () => void;
}

export const clearAdminTx = ({
  address,
  contractAddress,
  fee,
  memo,
  client,
  onTxSucceed,
}: ClearAdminTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<ChangeAdminResult>({
      postFn: () => client.clearAdmin(address, contractAddress, fee, memo),
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
            value: txFee ? formatUFee(txFee) : "N/A",
          },
        ],
        receiptInfo: {
          header: "Clear Admin Complete!",
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
  )().pipe(catchTxError());
};
