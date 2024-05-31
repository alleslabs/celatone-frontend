import { zBechAddr } from "lib/types";
import type { Addr } from "lib/types";
import { parseWithError } from "lib/utils";

const USERNAME_MODULE =
  "0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a";

export const getInitiaUsernameByAddress = async (
  endpoint: string,
  address: Addr
) => {
  const { createInitiaUsernamesClient } = await import("@initia/utils");

  const client = createInitiaUsernamesClient(endpoint, USERNAME_MODULE);
  return client.getUsername(address);
};

export const getAddressByInitiaUsername = async (
  endpoint: string,
  username: string
) => {
  const { createInitiaUsernamesClient } = await import("@initia/utils");

  const client = createInitiaUsernamesClient(endpoint, USERNAME_MODULE);
  return client
    .getAddress(username)
    .then((data) => (data ? parseWithError(zBechAddr, data) : null));
};
