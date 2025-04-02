import type { AssetInfo, AssetInfos, ConsensusPubkey, Option } from "lib/types";

import { Ripemd160, sha256 } from "@cosmjs/crypto";
import { fromBase64, fromHex, toBech32, toHex } from "@cosmjs/encoding";
import { zConsensusAddr } from "lib/types";

export const convertRawConsensusAddrToConsensusAddr = (
  rawConsensusAddr: string,
  prefix: string
) => {
  const data = fromBase64(rawConsensusAddr);
  return zConsensusAddr.parse(toBech32(`${prefix}valcons`, data));
};

export const convertConsensusPubkeyToConsensusAddr = (
  consensusPubkey: ConsensusPubkey,
  prefix: string
) => {
  if (consensusPubkey["@type"] === "/cosmos.crypto.ed25519.PubKey") {
    const pubkey = fromBase64(consensusPubkey.key);
    const data = fromHex(toHex(sha256(pubkey)).slice(0, 40));
    return zConsensusAddr.parse(toBech32(`${prefix}valcons`, data));
  }

  if (consensusPubkey["@type"] === "/cosmos.crypto.secp256k1.PubKey") {
    const pubkey = fromBase64(consensusPubkey.key);
    const data = new Ripemd160().update(sha256(pubkey)).digest();
    return zConsensusAddr.parse(toBech32(`${prefix}valcons`, data));
  }

  return zConsensusAddr.parse("");
};

export const getStakingAssetInfo = (
  singleStakingDenom: Option<string>,
  assetInfos: Option<AssetInfos>
): Option<AssetInfo> => {
  if (singleStakingDenom) return assetInfos?.[singleStakingDenom];
  //  NOTE: divided by 1e6 for initia case
  return {
    coingecko: "",
    description: "",
    id: "",
    logo: "",
    name: "",
    precision: 6,
    price: 0,
    slugs: [],
    symbol: "",
    type: "",
  };
};
