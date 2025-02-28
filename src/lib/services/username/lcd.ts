import { INITIA_USERNAME_LCD, INITIA_USERNAME_MODULE_ADDRESS } from "env";
import type { HexAddr, HexAddr32 } from "lib/types";
import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";
import { getMoveViewJsonLcd } from "../move/module/lcd";

export const getInitiaUsernameByAddress = async (address: HexAddr) =>
  getMoveViewJsonLcd(
    INITIA_USERNAME_LCD,
    INITIA_USERNAME_MODULE_ADDRESS as HexAddr32,
    "usernames",
    "get_name_from_address",
    [],
    [`"${address}"`]
  ).then((data) => (data ? `${data}.init` : null));

export const getAddressByInitiaUsername = async (username: string) =>
  getMoveViewJsonLcd(
    INITIA_USERNAME_LCD,
    INITIA_USERNAME_MODULE_ADDRESS as HexAddr32,
    "usernames",
    "get_address_from_name",
    [],
    [`"${username.toLowerCase().replace(".init", "")}"`]
  ).then((data) => (data ? parseWithError(zHexAddr, data) : null));
