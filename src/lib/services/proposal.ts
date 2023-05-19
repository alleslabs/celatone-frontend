import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import type {
  AccessConfigPermission,
  Addr,
  SnakeToCamelCaseNested,
} from "lib/types";
import { snakeToCamel } from "lib/utils";

interface DepositParams {
  min_deposit: Coin[];
  max_deposit_period: string;
  min_expedited_deposit: Coin[];
  min_initial_deposit_ratio: string;
}

export type DepositParamsInternal = SnakeToCamelCaseNested<DepositParams>;

export const fetchGovDepositParams = (
  lcdEndpoint: string
): Promise<DepositParamsInternal> =>
  axios
    .get<{ deposit_params: DepositParams }>(
      `${lcdEndpoint}/cosmos/gov/v1beta1/params/deposit`
    )
    .then(
      ({ data }) => snakeToCamel(data.deposit_params) as DepositParamsInternal
    );

interface ProposalVotingPeriod {
  proposal_type: string;
  voting_period: string;
}

interface VotingParams {
  voting_period: string;
  proposal_voting_periods: ProposalVotingPeriod[];
  expedited_voting_period: string;
}

export type VotingParamsInternal = SnakeToCamelCaseNested<VotingParams>;

export const fetchGovVotingParams = (
  lcdEndpoint: string
): Promise<VotingParamsInternal> =>
  axios
    .get<{ voting_params: VotingParams }>(
      `${lcdEndpoint}/cosmos/gov/v1beta1/params/voting`
    )
    .then(
      ({ data }) =>
        snakeToCamel(
          data.voting_params
        ) as SnakeToCamelCaseNested<VotingParamsInternal>
    );

export interface UploadAccess {
  permission: AccessConfigPermission;
  address: Addr;
  addresses?: Addr[];
}

export const fetchGovUploadAccessParams = async (
  lcdEndpoint: string
): Promise<UploadAccess> =>
  axios
    .get(`${lcdEndpoint}/cosmwasm/wasm/v1/codes/params`)
    .then(({ data }) => data.params.code_upload_access);
