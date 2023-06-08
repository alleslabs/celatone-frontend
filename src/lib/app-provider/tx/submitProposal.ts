import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

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
  const { address, getCosmWasmClient } = useWallet();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
      whitelistNumber,
      amountToVote,
    }: SubmitWhitelistProposalStreamParams) => {
      const client = await getCosmWasmClient();
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
    [address, getCosmWasmClient]
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
  const { address, getCosmWasmClient, currentChainName } = useWallet();
  return useCallback(
    async ({
      estimatedFee,
      messages,
      wasmFileName,
      amountToVote,
      onTxSucceed,
      onTxFailed,
    }: SubmitStoreCodeProposalStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client || !currentChainName)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return submitStoreCodeProposalTx({
        address: address as HumanAddr,
        chainName: currentChainName,
        client,
        onTxSucceed,
        onTxFailed,
        fee: estimatedFee,
        messages,
        wasmFileName,
        amountToVote,
      });
    },
    [address, currentChainName, getCosmWasmClient]
  );
};
