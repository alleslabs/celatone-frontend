import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
import {
  submitStoreCodeProposalTx,
  submitWhitelistProposalTx,
} from "lib/app-fns/tx/submitProposal";
import type { HumanAddr } from "lib/types";

export interface SubmitWhitelistProposalStreamParams {
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
  whitelistNumber: number;
  amountToVote: string | null;
}

export const useSubmitWhitelistProposalTx = () => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
      whitelistNumber,
      amountToVote,
    }: SubmitWhitelistProposalStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return submitWhitelistProposalTx({
        address: address as HumanAddr,
        client,
        onTxSucceed,
        onTxFailed,
        fee: estimatedFee,
        messages,
        whitelistNumber,
        amountToVote,
      });
    },
    [address, getSigningCosmWasmClient]
  );
};

interface SubmitStoreCodeProposalStreamParams {
  wasmFileName: string;
  messages: EncodeObject[];
  amountToVote: string | null;
  estimatedFee?: StdFee;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useSubmitStoreCodeProposalTx = () => {
  const { address, getSigningCosmWasmClient, chain } = useCurrentChain();
  return useCallback(
    async ({
      estimatedFee,
      messages,
      wasmFileName,
      amountToVote,
      onTxSucceed,
      onTxFailed,
    }: SubmitStoreCodeProposalStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client || !chain.chain_name)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return submitStoreCodeProposalTx({
        address: address as HumanAddr,
        chainName: chain.chain_name,
        client,
        onTxSucceed,
        onTxFailed,
        fee: estimatedFee,
        messages,
        wasmFileName,
        amountToVote,
      });
    },
    [address, chain.chain_name, getSigningCosmWasmClient]
  );
};
