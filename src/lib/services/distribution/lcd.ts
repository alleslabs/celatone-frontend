import axios from "axios";

import {
  zCommissionResponseLcd,
  zDelegationRewardsResponseLcd,
} from "lib/services/types";
import type { BechAddr, ValidatorAddr } from "lib/types";

export const getDelegationRewardsByAddressLcd = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/distribution/v1beta1/delegators/${encodeURI(address)}/rewards`
    )
    .then(({ data }) => zDelegationRewardsResponseLcd.parse(data));

export const getCommissionByValidatorAddressLcd = (
  endpoint: string,
  valAddr: ValidatorAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/distribution/v1beta1/validators/${encodeURI(valAddr)}/commission`
    )
    .then(({ data }) => zCommissionResponseLcd.parse(data));
