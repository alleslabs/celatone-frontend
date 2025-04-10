import type { HexAddr, HexAddr32 } from "lib/types";

import { zHexAddr } from "lib/types";
import { parseWithError } from "lib/utils";

import { getMoveViewJsonRest } from "../move/module/rest";

export const getInitiaUsernameByAddress = async (
  l1Rest: string,
  usernameModule: HexAddr32,
  address: HexAddr
) =>
  getMoveViewJsonRest(
    l1Rest,
    usernameModule,
    "usernames",
    "get_name_from_address",
    [],
    [`"${address}"`]
  ).then((data) => (data ? `${data}.init` : null));

export const getAddressByInitiaUsername = async (
  l1Rest: string,
  usernameModule: HexAddr32,
  username: string
) =>
  getMoveViewJsonRest(
    l1Rest,
    usernameModule,
    "usernames",
    "get_address_from_name",
    [],
    [`"${username.toLowerCase().replace(".init", "")}"`]
  ).then((data) => (data ? parseWithError(zHexAddr, data) : null));
