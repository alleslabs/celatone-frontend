import type { EncodeObject } from "@cosmjs/proto-signing";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { submitProposalTx } from "lib/app-fns/tx/submitProposal";
import type { HumanAddr } from "lib/types";

export interface SubmitProposalStreamParams {
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
  estimatedFee?: StdFee;
  messages: EncodeObject[];
  whitelistNumber: number;
  amountToVote: string | null;
}

export const useSubmitProposalTx = () => {
  const { address, getCosmWasmClient } = useWallet();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      messages,
      whitelistNumber,
      amountToVote,
    }: SubmitProposalStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;
      return submitProposalTx({
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
