import type { Log } from "@cosmjs/stargate/build/logs";
import { snakeCase } from "snake-case";

import type { TypeUrl } from "lib/data";
import type { MsgBody } from "lib/services/tx";
import type { Option } from "lib/types";

import { findAttr } from "./findAttr";
import type { MsgReturnType } from "./types";

type MsgBodyWithoutType = Omit<MsgBody, "@type">;

const transformKeyToSnake = (obj: MsgBodyWithoutType): MsgBodyWithoutType => {
  return Object.entries(obj).reduce((acc, entry) => {
    const [k, v] = entry;
    // check if the key is camelCase
    if (/^([a-z]+)(([A-Z]([a-z]+))+)$/.test(k)) {
      acc[snakeCase(k)] = v;
    } else {
      acc[k] = v;
    }
    return acc;
  }, {} as MsgBodyWithoutType);
};

export const extractTxDetails = <T extends TypeUrl>(
  type: T,
  body: MsgBodyWithoutType,
  log: Option<Log>
): MsgReturnType<T> => {
  /**
   * @remarks Some keys are in camelCase due to old protobuf decoding
   */
  const msgBody = transformKeyToSnake(body);
  switch (type) {
    case "/cosmwasm.wasm.v1.MsgStoreCode":
      return {
        type,
        ...msgBody,
        code_id: findAttr(log, "store_code", "code_id"),
      } as MsgReturnType<T>;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      return {
        type,
        ...msgBody,
        contract_address: findAttr(log, "instantiate", "_contract_address"),
      } as MsgReturnType<T>;
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      return {
        type,
        ...msgBody,
        proposal_id: findAttr(log, "submit_proposal", "proposal_id"),
        proposal_type: findAttr(log, "submit_proposal", "proposal_type"),
      } as MsgReturnType<T>;
    default:
      return { type, ...msgBody } as MsgReturnType<T>;
  }
};
