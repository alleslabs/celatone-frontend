import type { Coin } from "@cosmjs/stargate";

import { jsonPrettify } from "lib/utils";

/**
 * @remarks Use as form key
 */
export const ASSETS_SELECT = "assetsSelect";
export const ASSETS_JSON_STR = "assetsJsonStr";
export const ATTACH_FUNDS_OPTION = "attachFundsOption";

/**
 * @remarks Default value for assets
 */
export const defaultAsset = [{ amount: "", denom: "" }] as Coin[];
export const defaultAssetJsonStr = jsonPrettify(JSON.stringify(defaultAsset));
