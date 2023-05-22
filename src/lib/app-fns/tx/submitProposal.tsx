import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee, logs } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import type { Observable } from "rxjs";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { HumanAddr, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { findAttr, formatUFee } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface SubmitProposalTxParams {
  address: HumanAddr;
  client: SigningCosmWasmClient;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
  fee: StdFee;
  messages: EncodeObject[];
  whitelistNumber: number;
  amountToVote: string | null;
}

export const submitProposalTx = ({
  address,
  client,
  onTxSucceed,
  onTxFailed,
  fee,
  messages,
  whitelistNumber,
  amountToVote,
}: SubmitProposalTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => client.signAndBroadcast(address, messages, fee),
    }),
    ({ value: txInfo }) => {
      AmpTrack(AmpEvent.TX_SUCCEED);
      onTxSucceed?.();
      const mimicLog: logs.Log = {
        msg_index: 0,
        log: "",
        events: txInfo.events,
      };
      const txFee = findAttr(mimicLog, "tx", "fee");
      const proposalId =
        findAttr(mimicLog, "submit_proposal", "proposal_id") ?? "";
      return {
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [
          {
            title: "Proposal ID",
            value: proposalId,
            html: (
              <ExplorerLink type="proposal_id" value={proposalId} openNewTab />
            ),
          },
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
          header: "Proposal Submitted",
          description: `Proposed ${whitelistNumber} ${
            whitelistNumber > 1 ? "addresses" : "address"
          } to whitelisting${
            amountToVote
              ? ` and pending minimum deposit of ${amountToVote} to trigger voting period.`
              : "."
          }`,
          headerIcon: (
            <CustomIcon
              name="submit-proposal-solid"
              color="gray.600"
              boxSize="5"
            />
          ),
        },
        actionVariant: "proposal",
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
