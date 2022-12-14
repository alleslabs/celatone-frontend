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
import type { Activity } from "lib/stores/contract";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { encode, formatUFee } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface ExecuteTxParams {
  address: string;
  contractAddress: string;
  fee: StdFee;
  msg: object;
  client: SigningCosmWasmClient;
  userKey: string;
  onTxSucceed?: (userKey: string, activity: Activity) => void;
  onTxFailed?: () => void;
}

export const executeContractTx = ({
  address,
  contractAddress,
  fee,
  msg,
  client,
  userKey,
  onTxSucceed,
  onTxFailed,
}: ExecuteTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<ExecuteResult>({
      postFn: () => client.execute(address, contractAddress, msg, fee),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.(userKey, {
        type: "execute",
        action: Object.keys(msg)[0],
        sender: address,
        contractAddress,
        msg: encode(JSON.stringify(msg)), // base64
        timestamp: new Date(),
      });
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
            value: `${formatUFee(
              txInfo.events.find((e) => e.type === "tx")?.attributes[0].value ??
                "0u"
            )}`,
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
  )().pipe(catchTxError(fee, onTxFailed));
};
