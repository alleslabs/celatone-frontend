import type {
  ExecuteResult,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Activity } from "lib/stores/contract";
import type { ContractAddr, HumanAddr, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { encode, formatUFee, getCurrentDate } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface ExecuteTxParams {
  address: HumanAddr;
  contractAddress: ContractAddr;
  fee: StdFee;
  msg: object;
  funds: Coin[];
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
  funds,
  client,
  userKey,
  onTxSucceed,
  onTxFailed,
}: ExecuteTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx<ExecuteResult>({
      postFn: () =>
        client.execute(address, contractAddress, msg, fee, undefined, funds),
    }),
    ({ value: txInfo }) => {
      AmpTrack(AmpEvent.TX_SUCCEED);
      onTxSucceed?.(userKey, {
        type: "execute",
        action: Object.keys(msg)[0],
        sender: address,
        contractAddress,
        msg: encode(
          JSON.stringify({
            msg,
            funds,
          })
        ), // base64
        timestamp: getCurrentDate(),
      });
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
          header: "Transaction Completed",
          headerIcon: (
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize="5"
            />
          ),
        },
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
