import type { HexAddr, HexAddr32 } from "lib/types";
import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";
import { getMoveViewJsonLcd } from "../move/module/lcd";

const INITIATION_2_LCD = "https://rest.initiation-2.initia.xyz";
const USERNAME_MODULE_ADDRESS =
  "0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a" as HexAddr32;

export const getInitiaUsernameByAddress = async (address: HexAddr) =>
  getMoveViewJsonLcd(
    INITIATION_2_LCD,
    USERNAME_MODULE_ADDRESS,
    "usernames",
    "get_name_from_address",
    [],
    [`"${address}"`]
  ).then((data) => (data ? `${data}.init` : null));

export const getAddressByInitiaUsername = async (username: string) =>
  getMoveViewJsonLcd(
    INITIATION_2_LCD,
    USERNAME_MODULE_ADDRESS,
    "usernames",
    "get_address_from_name",
    [],
    [`"${username.toLowerCase().replace(".init", "")}"`]
  ).then((data) => (data ? parseWithError(zHexAddr, data) : null));
