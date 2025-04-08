import { TESTNET } from "@initia/react-wallet-widget/ssr";
import type { HexAddr } from "lib/types";
import { zHexAddr, zHexAddr32 } from "lib/types";
import { parseWithError } from "lib/utils";
import { getMoveViewJsonRest } from "../move/module/rest";

const l1Rest = TESTNET.apiUrl.replace("api", "rest");

export const getInitiaUsernameByAddress = async (address: HexAddr) =>
  getMoveViewJsonRest(
    l1Rest,
    zHexAddr32.parse(TESTNET.modules.usernames),
    "usernames",
    "get_name_from_address",
    [],
    [`"${address}"`]
  ).then((data) => (data ? `${data}.init` : null));

export const getAddressByInitiaUsername = async (username: string) =>
  getMoveViewJsonRest(
    l1Rest,
    zHexAddr32.parse(TESTNET.modules.usernames),
    "usernames",
    "get_address_from_name",
    [],
    [`"${username.toLowerCase().replace(".init", "")}"`]
  ).then((data) => (data ? parseWithError(zHexAddr, data) : null));
