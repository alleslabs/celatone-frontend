import { Icon } from "@chakra-ui/react";
import type {
  SigningCosmWasmClient,
  ChangeAdminResult,
} from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import { MdCheckCircle } from "react-icons/md";
import type { Observable } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TxStreamPhase } from "lib/types";
import type { TxResultRendering, ContractAddr } from "lib/types";
import { formatUFee } from "lib/utils";

import { catchTxError } from "./common/catchTxError";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface ClearAdminTxParams {
  address: string;
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
              <ExplorerLink type="tx_hash" value={txInfo.transactionHash} />
            ),
          },
          {
            title: "Tx Fee",
            value: txFee ? formatUFee(txFee) : "N/A",
          },
        ],
        receiptInfo: {
          header: "Transaction Complete",
          headerIcon: (
            <Icon as={MdCheckCircle} color="success.main" boxSize={6} />
          ),
        },
      } as TxResultRendering;
    }
  )().pipe(catchTxError());
};
