import axios from "axios";

import { getTxsByAccountAddressSequencer } from "../tx/sequencer";
import { zEvmCodesByAddressResponseLcd, zEvmParams } from "../types/evm";
import type { HexAddr20 } from "lib/types";
import {
  convertAccountPubkeyToAccountAddress,
  parseWithError,
} from "lib/utils";
import { zEvmMsgCreate } from "../types";

export const getEvmParams = (endpoint: string) =>
  axios
    .get(`${endpoint}/minievm/evm/v1/params`)
    .then(({ data }) => parseWithError(zEvmParams, data));

export const getEvmCodesByAddress = (endpoint: string, address: HexAddr20) =>
  axios
    .get(`${endpoint}/minievm/evm/v1/codes/${encodeURI(address)}`)
    .then(({ data }) => parseWithError(zEvmCodesByAddressResponseLcd, data));

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

  const foundMsgCreate = tx.messages.find(
    (msg) => msg.type === "/minievm.evm.v1.MsgCreate"
  );
  const evmMsgCreate = zEvmMsgCreate.parse(foundMsgCreate);

  return {
    hash: tx.hash,
    sender,
    created: tx.created,
    code: evmMsgCreate.code,
  };
};
