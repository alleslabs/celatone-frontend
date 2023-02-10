import { Icon } from "@chakra-ui/react";
import type {
  MigrateResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import { MdCheckCircle } from "react-icons/md";
import type { Observable } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ContractAddr, HumanAddr, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { formatUFee } from "lib/utils";

import { catchTxError } from "./common/catchTxError";
import { postTx } from "./common/post";
import { sendingTx } from "./common/sending";

interface MigrateTxParams {
  sender: HumanAddr;
  contractAddress: ContractAddr;
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
              <ExplorerLink type="tx_hash" value={txInfo.transactionHash} />
            ),
          },
          {
            title: "Tx Fee",
            value: txFee ? formatUFee(txFee) : "N/A",
          },
        ],
        receiptInfo: {
          header: "Migration Completed",
          headerIcon: (
            <Icon as={MdCheckCircle} fontSize="24px" color="success.main" />
          ),
        },
        actionVariant: "migrate",
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
