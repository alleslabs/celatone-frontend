import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import {
  submitStoreCodeProposalTx,
  submitWhitelistProposalTx,
} from "lib/app-fns/tx/submitProposal";
import type { HumanAddr, Nullable } from "lib/types";

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
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
      whitelistNumber,
      amountToVote,
    }: SubmitWhitelistProposalStreamParams) => {
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return submitWhitelistProposalTx({
        address: address as HumanAddr,
        client,
        fee: estimatedFee,
        messages,
        whitelistNumber,
        amountToVote,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [address, getSigningClient]
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
        fee: estimatedFee,
        messages,
        wasmFileName,
        amountToVote,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [address, chain.chain_name, getSigningCosmWasmClient]
  );
};
