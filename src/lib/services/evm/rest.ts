import type { HexAddr20 } from "lib/types";

import axios from "axios";
import {
  convertAccountPubkeyToAccountAddress,
  parseWithError,
} from "lib/utils";

import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import { zEvmMsgCreate } from "../types";
import { zEvmCodesByAddressResponseRest, zEvmParams } from "../types/evm";

export const getEvmParams = (endpoint: string) =>
  axios
    .get(`${endpoint}/minievm/evm/v1/params`)
    .then(({ data }) => parseWithError(zEvmParams, data));

export const getEvmCodesByAddress = (endpoint: string, address: HexAddr20) =>
  axios
    .get(`${endpoint}/minievm/evm/v1/codes/${encodeURI(address)}`)
    .then(({ data }) => parseWithError(zEvmCodesByAddressResponseRest, data));

export const getEvmContractInfoSequencer = async (
  endpoint: string,
  prefix: string,
  address: HexAddr20
) => {
  const txs = await getTxsByAccountAddressSequencer({
    endpoint,
    address,
    limit: 1,
    reverse: false,
  });

  if (!txs.items.length) throw new Error(`No transactions found`);

  const tx = txs.items[0];
  const sender = convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix);

  const eventCreates = tx.events?.filter(
    (event) =>
      event.type === "create" && event.attributes[0]?.key === "contract"
  );
  const eventCreateIndex = eventCreates?.findIndex(
    (event) => event.attributes[0]?.key === "contract"
  );
  const msgCreates = tx.messages.filter(
    (msg) => msg.type === "/minievm.evm.v1.MsgCreate"
  );
  const code =
    eventCreateIndex && eventCreateIndex >= 0
      ? zEvmMsgCreate.parse(msgCreates[eventCreateIndex]).code
      : undefined;

  return {
    hash: tx.hash,
    sender,
    created: tx.created,
    code,
  };
};
