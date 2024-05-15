import axios from "axios";

import {
  zCommissionsResponseLcd,
  zDelegationRewardsResponseLcd,
} from "lib/services/types";
import type { BechAddr, ValidatorAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getDelegationRewardsByAddressLcd = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/distribution/v1beta1/delegators/${encodeURI(address)}/rewards`
    )
    .then(({ data }) => parseWithError(zDelegationRewardsResponseLcd, data));

export const getCommissionsByValidatorAddressLcd = (
  endpoint: string,
  valAddr: ValidatorAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/distribution/v1beta1/validators/${encodeURI(valAddr)}/commission`
    )
    .then(
      ({ data }) => parseWithError(zCommissionsResponseLcd, data).commission
    );
