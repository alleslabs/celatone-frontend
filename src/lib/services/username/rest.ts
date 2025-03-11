import { INITIA_USERNAME_LCD, INITIA_USERNAME_MODULE_ADDRESS } from "env";
import type { HexAddr } from "lib/types";
import { zHexAddr, zHexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";
import { getMoveViewJsonRest } from "../move/module/rest";

export const getInitiaUsernameByAddress = async (address: HexAddr) =>
  getMoveViewJsonRest(
    INITIA_USERNAME_LCD,
    zHexAddr32.parse(INITIA_USERNAME_MODULE_ADDRESS),
    "usernames",
    "get_name_from_address",
    [],
    [`"${address}"`]
  ).then((data) => (data ? `${data}.init` : null));

export const getAddressByInitiaUsername = async (username: string) =>
  getMoveViewJsonRest(
    INITIA_USERNAME_LCD,
    zHexAddr32.parse(INITIA_USERNAME_MODULE_ADDRESS),
    "usernames",
    "get_address_from_name",
    [],
    [`"${username.toLowerCase().replace(".init", "")}"`]
  ).then((data) => (data ? parseWithError(zHexAddr, data) : null));
