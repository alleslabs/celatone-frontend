import axios from "axios";

import type { AssetInfo } from "lib/types";

export const getAssetInfo = async (
  baseApiRoute: string,
  denom: string
): Promise<AssetInfo> => {
  if (!baseApiRoute) throw new Error("Failed to retrieve assets API route.");
  if (!denom.trim().length) throw new Error("Empty denom");
  const { data } = await axios.get(`${baseApiRoute}/${denom}`);
  return data;
};

export const getAssetInfos = async (
  baseApiRoute: string
): Promise<AssetInfo[]> => {
  if (!baseApiRoute) throw new Error("Failed to retrieve assets API route.");
  const { data } = await axios.get<AssetInfo[]>(`${baseApiRoute}/prices`);
  return data;
};
