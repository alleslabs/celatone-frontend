import type { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee, logs } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import { capitalize } from "lodash";
import type { Observable } from "rxjs";

import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { BechAddr20, Nullable, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface SubmitWhitelistProposalTxParams {
  address: BechAddr20;
  client: SigningCosmWasmClient;
  fee: StdFee;
  messages: EncodeObject[];
  whitelistNumber: number;
  amountToVote: Nullable<string>;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const submitWhitelistProposalTx = ({
  address,
  client,
  fee,
  messages,
  whitelistNumber,
  amountToVote,
  onTxSucceed,
  onTxFailed,
}: SubmitWhitelistProposalTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => client.signAndBroadcast(address, messages, fee),
    }),
    ({ value: txInfo }) => {
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
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
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
              boxSize={5}
            />
          ),
        },
        actionVariant: "proposal",
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};

interface SubmitStoreCodeProposalTxParams {
  address: BechAddr20;
  client: SigningCosmWasmClient;
  fee: StdFee;
  chainName: string;
  wasmFileName: string;
  messages: EncodeObject[];
  amountToVote: Nullable<string>;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const submitStoreCodeProposalTx = ({
  address,
  client,
  fee,
  chainName,
  wasmFileName,
  messages,
  amountToVote,
  onTxSucceed,
  onTxFailed,
}: SubmitStoreCodeProposalTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => client.signAndBroadcast(address, messages, fee),
    }),
    ({ value: txInfo }) => {
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
            html: <ExplorerLink type="proposal_id" value={proposalId} />,
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
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
          },
        ],
        receiptInfo: {
          header: "Proposal Submitted",
          description: `${wasmFileName} is uploaded and pending ${
            amountToVote
              ? ` minimum deposit of ${amountToVote} to trigger voting period.`
              : ` ${capitalize(chainName)} governance voting.`
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
