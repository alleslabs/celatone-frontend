import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import type { Nullable } from "lib/types";

import { trackTxSucceed } from "lib/amplitude";
import {
  submitStoreCodeProposalTx,
  submitWhitelistProposalTx,
} from "lib/app-fns/tx/submitProposal";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";

export interface SubmitWhitelistProposalStreamParams {
  amountToVote: Nullable<string>;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
  whitelistNumber: number;
}

export const useSubmitWhitelistProposalTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      amountToVote,
      estimatedFee,
      messages,
      onTxFailed,
      onTxSucceed,
      whitelistNumber,
    }: SubmitWhitelistProposalStreamParams) => {
      if (!address)
        throw new Error("No address provided (useSubmitWhitelistProposalTx)");
      if (!estimatedFee) return null;
      return submitWhitelistProposalTx({
        address,
        amountToVote,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        signAndBroadcast,
        whitelistNumber,
      });
    },
    [address, signAndBroadcast]
  );
};

interface SubmitStoreCodeProposalStreamParams {
  amountToVote: Nullable<string>;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
  wasmFileName: string;
}

export const useSubmitStoreCodeProposalTx = () => {
  const { address, chainName } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      amountToVote,
      estimatedFee,
      messages,
      onTxFailed,
      onTxSucceed,
      wasmFileName,
    }: SubmitStoreCodeProposalStreamParams) => {
      if (!address || !chainName)
        throw new Error("No address provided (useSubmitStoreCodeProposalTx)");
      if (!estimatedFee) return null;
      return submitStoreCodeProposalTx({
        address,
        amountToVote,
        chainName,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        signAndBroadcast,
        wasmFileName,
      });
    },
    [address, chainName, signAndBroadcast]
  );
};
