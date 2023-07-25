import axios from "axios";

import type { AssetInfo } from "lib/types";

export const getAssetInfo = async (
  baseApiRoute: string,
  denom: string
): Promise<AssetInfo> => {
  if (!denom.trim().length) throw new Error("Empty denom");
  const { data } = await axios.get(`${baseApiRoute}/${denom}`);
  return data;
};

export const getAssetInfos = async (
  baseApiRoute: string
): Promise<AssetInfo[]> => {
  const { data } = await axios.get<AssetInfo[]>(`${baseApiRoute}/prices`);
  return data;
};

export const getAssetInfosWithoutPricesPath = async (
  baseApiRoute: string
): Promise<AssetInfo[]> => {
  const { data } = await axios.get<AssetInfo[]>(`${baseApiRoute}`);
  return data;
};
