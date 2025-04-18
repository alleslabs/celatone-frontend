import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import type { SignAndBroadcast } from "lib/app-provider/hooks";
import type { BechAddr20, Nullable, TxResultRendering } from "lib/types";
import type { Observable } from "rxjs";

import { pipe } from "@rx-stream/pipe";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TxStreamPhase } from "lib/types";
import { feeFromStr, findAttr } from "lib/utils";
import { capitalize } from "lodash";

import { catchTxError, postTx, sendingTx } from "./common";

interface SubmitWhitelistProposalTxParams {
  address: BechAddr20;
  fee: StdFee;
  messages: EncodeObject[];
  whitelistNumber: number;
  amountToVote: Nullable<string>;
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
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
          header: "Proposal submitted",
          headerIcon: (
            <CustomIcon boxSize={5} color="gray.600" name="submit-proposal" />
          ),
        },
        receipts: [
          {
            html: (
              <ExplorerLink openNewTab type="proposal_id" value={proposalId} />
            ),
            title: "Proposal ID",
            value: proposalId,
          },
          {
            html: (
              <ExplorerLink
                openNewTab
                type="tx_hash"
                value={txInfo.transactionHash}
              />
            ),
            title: "Tx hash",
            value: txInfo.transactionHash,
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx fee",
          },
        ],
        value: null,
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};

interface SubmitStoreCodeProposalTxParams {
  address: BechAddr20;
  fee: StdFee;
  chainName: string;
  wasmFileName: string;
  messages: EncodeObject[];
  amountToVote: Nullable<string>;
  signAndBroadcast: SignAndBroadcast;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
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
          header: "Proposal submitted",
          headerIcon: (
            <CustomIcon boxSize="5" color="gray.600" name="submit-proposal" />
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
            title: "Tx hash",
            value: txInfo.transactionHash,
          },
          {
            html: (
              <EstimatedFeeRender
                estimatedFee={feeFromStr(txFee)}
                loading={false}
              />
            ),
            title: "Tx fee",
          },
        ],
        value: null,
      } as TxResultRendering;
    }
  )().pipe(catchTxError(onTxFailed));
};
