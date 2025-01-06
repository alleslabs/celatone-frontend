import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import {
  submitStoreCodeProposalTx,
  submitWhitelistProposalTx,
} from "lib/app-fns/tx/submitProposal";
import type { Nullable } from "lib/types";

export interface SubmitWhitelistProposalStreamParams {
  estimatedFee?: StdFee;
  messages: EncodeObject[];
  whitelistNumber: number;
  amountToVote: Nullable<string>;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useSubmitWhitelistProposalTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
      whitelistNumber,
      amountToVote,
    }: SubmitWhitelistProposalStreamParams) => {
      if (!address)
        throw new Error("No address provided (useSubmitWhitelistProposalTx)");
      if (!estimatedFee) return null;
      return submitWhitelistProposalTx({
        address,
        fee: estimatedFee,
        messages,
        whitelistNumber,
        amountToVote,
        signAndBroadcast,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [address, signAndBroadcast]
  );
};

interface SubmitStoreCodeProposalStreamParams {
  wasmFileName: string;
  messages: EncodeObject[];
  amountToVote: Nullable<string>;
  estimatedFee?: StdFee;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useSubmitStoreCodeProposalTx = () => {
  const { address, chainName } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      estimatedFee,
      messages,
      wasmFileName,
      amountToVote,
      onTxSucceed,
      onTxFailed,
    }: SubmitStoreCodeProposalStreamParams) => {
      if (!address || !chainName)
        throw new Error("No address provided (useSubmitStoreCodeProposalTx)");
      if (!estimatedFee) return null;
      return submitStoreCodeProposalTx({
        address,
        chainName,
        fee: estimatedFee,
        messages,
        wasmFileName,
        amountToVote,
        signAndBroadcast,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [address, chainName, signAndBroadcast]
  );
};
