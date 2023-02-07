import { Icon } from "@chakra-ui/react";
import type {
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import { MdCheckCircle } from "react-icons/md";
import type { Observable } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type {
  Addr,
  ContractAddr,
  HumanAddr,
  TxResultRendering,
} from "lib/types";
import { TxStreamPhase } from "lib/types";
import { formatUFee } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface UpdateAdminTxParams {
  address: HumanAddr;
  contractAddress: ContractAddr;
  newAdmin: Addr;
  fee: StdFee;
  client: SigningCosmWasmClient;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

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
              <ExplorerLink type="tx_hash" value={txInfo.transactionHash} />
            ),
          },
          {
            title: "Tx Fee",
            value: txFee ? formatUFee(txFee) : "N/A",
          },
        ],
        receiptInfo: {
          header: "Update Admin Complete",
          headerIcon: (
            <Icon as={MdCheckCircle} color="success.main" boxSize={6} />
          ),
        },
        actionVariant: "update-admin",
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
