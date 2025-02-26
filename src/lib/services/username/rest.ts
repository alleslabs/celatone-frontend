import type { HexAddr, HexAddr32 } from "lib/types";
import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";
import { getMoveViewJsonRest } from "../move/module/rest";

const INITIATION_2_REST = "https://rest.initiation-2.initia.xyz";
const USERNAME_MODULE_ADDRESS =
  "0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a" as HexAddr32;

export const getInitiaUsernameByAddress = async (address: HexAddr) =>
  getMoveViewJsonRest(
    INITIATION_2_REST,
    USERNAME_MODULE_ADDRESS,
    "usernames",
    "get_name_from_address",
    [],
    [`"${address}"`]
  ).then((data) => (data ? `${data}.init` : null));

export const getAddressByInitiaUsername = async (username: string) =>
  getMoveViewJsonRest(
    INITIATION_2_REST,
    USERNAME_MODULE_ADDRESS,
    "usernames",
    "get_address_from_name",
    [],
    [`"${username.toLowerCase().replace(".init", "")}"`]
  ).then((data) => (data ? parseWithError(zHexAddr, data) : null));
