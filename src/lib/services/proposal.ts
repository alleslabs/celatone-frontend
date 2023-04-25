import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import type { AccessConfigPermission, Addr } from "lib/types";

export interface DepositParams {
  min_deposit: Coin[];
  max_deposit_period: string;
  min_expedited_deposit: Coin[];
  min_initial_deposit_ratio: string;
}

export const fetchGovDepositParams = (
  lcdEndpoint: string
): Promise<DepositParams> =>
  axios
    .get(`${lcdEndpoint}/cosmos/gov/v1beta1/params/deposit`)
    .then(({ data }) => data.deposit_params);

interface ProposalVotingPeriod {
  proposal_type: string;
  voting_period: string;
}

export interface VotingParams {
  voting_period: string;
  proposal_voting_periods: ProposalVotingPeriod[];
  expedited_voting_period: string;
}

export const fetchGovVotingParams = (
  lcdEndpoint: string
): Promise<VotingParams> =>
  axios
    .get(`${lcdEndpoint}/cosmos/gov/v1beta1/params/voting`)
    .then(({ data }) => data.voting_params);

export interface UploadAccess {
  permission: AccessConfigPermission;
  addresses?: Addr[];
}

export const fetchGovUploadAccessParams = async (
  lcdEndpoint: string
): Promise<UploadAccess> =>
  axios
    .get(
      `${lcdEndpoint}/cosmos/params/v1beta1/params?subspace=wasm&key=uploadAccess`
    )
    .then(({ data }) => JSON.parse(data.param.value));
