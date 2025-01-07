import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { pipe } from "@rx-stream/pipe";
import { capitalize } from "lodash";
import type { Observable } from "rxjs";

import type { SignAndBroadcast } from "lib/app-provider/hooks";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { BechAddr20, Nullable, TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";

import { catchTxError, postTx, sendingTx } from "./common";

interface SubmitWhitelistProposalTxParams {
  address: BechAddr20;
  amountToVote: Nullable<string>;
  fee: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
  signAndBroadcast: SignAndBroadcast;
  whitelistNumber: number;
}

export const submitWhitelistProposalTx = ({
  address,
  amountToVote,
  fee,
  messages,
  onTxFailed,
  onTxSucceed,
  signAndBroadcast,
  whitelistNumber,
}: SubmitWhitelistProposalTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.();
      const txFee = findAttr(txInfo.events, "tx", "fee");
      const proposalId =
        findAttr(txInfo.events, "submit_proposal", "proposal_id") ?? "";

      return {
        actionVariant: "proposal",
        phase: TxStreamPhase.SUCCEED,
        receiptInfo: {
          description: `Proposed ${whitelistNumber} ${
            whitelistNumber > 1 ? "addresses" : "address"
          } to whitelisting${
            amountToVote
              ? ` and pending minimum deposit of ${amountToVote} to trigger voting period.`
              : "."
          }`,
          header: "Proposal Submitted",
          headerIcon: (
            <CustomIcon name="submit-proposal" boxSize={5} color="gray.600" />
          ),
        },
        receipts: [
          {
            html: (
              <ExplorerLink type="proposal_id" value={proposalId} openNewTab />
            ),
            title: "Proposal ID",
            value: proposalId,
          },
          {
            html: (
              <ExplorerLink
                type="tx_hash"
                value={txInfo.transactionHash}
                openNewTab
              />
            ),
            title: "Tx Hash",
            value: txInfo.transactionHash,
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx Fee",
          },
        ],
        value: null,
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};

interface SubmitStoreCodeProposalTxParams {
  address: BechAddr20;
  amountToVote: Nullable<string>;
  chainName: string;
  fee: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
  signAndBroadcast: SignAndBroadcast;
  wasmFileName: string;
}

export const submitStoreCodeProposalTx = ({
  address,
  amountToVote,
  chainName,
  fee,
  messages,
  onTxFailed,
  onTxSucceed,
  signAndBroadcast,
  wasmFileName,
}: SubmitStoreCodeProposalTxParams): Observable<TxResultRendering> => {
  return pipe(
    sendingTx(fee),
    postTx({
      postFn: () => signAndBroadcast({ address, fee, messages }),
    }),
    ({ value: txInfo }) => {
      onTxSucceed?.();
      const txFee = findAttr(txInfo.events, "tx", "fee");
      const proposalId =
        findAttr(txInfo.events, "submit_proposal", "proposal_id") ?? "";

      return {
        actionVariant: "proposal",
        phase: TxStreamPhase.SUCCEED,
        receiptInfo: {
          description: `${wasmFileName} is uploaded and pending ${
            amountToVote
              ? ` minimum deposit of ${amountToVote} to trigger voting period.`
              : ` ${capitalize(chainName)} governance voting.`
          }`,
          header: "Proposal Submitted",
          headerIcon: (
            <CustomIcon name="submit-proposal" boxSize="5" color="gray.600" />
          ),
        },
        receipts: [
          {
            html: <ExplorerLink type="proposal_id" value={proposalId} />,
            title: "Proposal ID",
            value: proposalId,
          },
          {
            html: (
              <ExplorerLink type="tx_hash" value={txInfo.transactionHash} />
            ),
            title: "Tx Hash",
            value: txInfo.transactionHash,
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx Fee",
          },
        ],
        value: null,
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
