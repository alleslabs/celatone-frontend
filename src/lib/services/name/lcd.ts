import axios from "axios";

import type { BechAddr } from "lib/types";
import { zAddressByIcnsName, zIcnsNamesByAddress } from "lib/types/name";
import { encode, parseWithError } from "lib/utils";

const icnsResolverAddress =
  "osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd";

export const getIcnsNamesByAddressLcd = async (
  endpoint: string,
  address: BechAddr
) => {
  const encoded = encode(
    JSON.stringify({
      icns_names: {
        address,
      },
    })
  );

  return axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${icnsResolverAddress}/smart/${encoded}`
    )
    .then(({ data }) => parseWithError(zIcnsNamesByAddress, data));
};

export const getAddressByIcnsNameLcd = async (
  endpoint: string,
  name: string,
  bech32Prefix: string
) => {
  const encoded = encode(
    JSON.stringify({ address: { bech32_prefix: bech32Prefix, name } })
  );

  return axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${icnsResolverAddress}/smart/${encoded}`
    )
    .then(({ data }) => parseWithError(zAddressByIcnsName, data));
};
