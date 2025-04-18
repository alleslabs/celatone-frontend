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
