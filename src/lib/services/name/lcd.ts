import axios from "axios";

import type { BechAddr } from "lib/types";
import { zAddressByICNSName, zICNSNamesByAddress } from "lib/types/name";
import { encode, parseWithError } from "lib/utils";

const icnsResolverAddress =
  "osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd";

export const getICNSNamesByAddressLcd = async (
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
    .then(({ data }) => parseWithError(zICNSNamesByAddress, data));
};

export const getAddressByICNSNameLcd = async (
  endpoint: string,
  name: string,
  bech32Prefix: string
) => {
  const encoded = encode(
    JSON.stringify({ address: { name, bech32_prefix: bech32Prefix } })
  );

  return axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${icnsResolverAddress}/smart/${encoded}`
    )
    .then(({ data }) => parseWithError(zAddressByICNSName, data));
};
