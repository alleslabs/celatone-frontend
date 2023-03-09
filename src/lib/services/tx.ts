import type { Event } from "@cosmjs/stargate";
import type { Log } from "@cosmjs/stargate/build/logs";
import axios from "axios";
import type { CompactBitArray } from "cosmjs-types/cosmos/crypto/multisig/v1beta1/multisig";
import type { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import type { Any } from "cosmjs-types/google/protobuf/any";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import type { Option, Fee } from "lib/types";
import { parseDateOpt } from "lib/utils";

// ----------------------------------------
// --------------AuthInfo------------------
// ----------------------------------------
interface AuthInfo {
  signer_infos: SignerInfo[];
  fee?: Fee;
}

interface SignerInfo {
  public_key?: { "@type": string; key: string };
  mode_info?: ModeInfo;
  sequence: string;
}

interface ModeInfo {
  single?: ModeInfoSingle | undefined;
  multi?: ModeInfoMulti | undefined;
}

interface ModeInfoSingle {
  mode: keyof typeof SignMode;
}

// Revisit Multisig Info
interface ModeInfoMulti {
  bitarray?: CompactBitArray;
  modeInfos: ModeInfo[];
}

// ----------------------------------------
// -----------------Tx---------------------
// ----------------------------------------
export interface MsgBody {
  "@type": string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TxBody {
  messages: MsgBody[];
  memo: string;
  timeout_height: string;
  // Revisit extension options
  extension_options: Any[];
  non_critical_extension_options: Any[];
}

export interface Tx {
  "@type": string;
  body: TxBody;
  auth_info: AuthInfo;
  signatures: string[];
}

export interface TxResponse {
  height: string;
  txhash: string;
  codespace: string;
  code: number;
  data: string;
  raw_log: string;
  logs: Log[];
  info: string;
  gas_wanted: string;
  gas_used: string;
  tx: Tx;
  timestamp: Option<Date>;
  events: Event[];
}

export const queryTxData = async (
  chainName: string,
  chainId: string,
  txHash: string
): Promise<TxResponse> => {
  const { data } = await axios.get(
    `${CELATONE_API_ENDPOINT}/txs/${getChainApiPath(
      chainName
    )}/${chainId}/${txHash}`
  );

  return {
    ...data.tx_response,
    timestamp: parseDateOpt(data.tx_response.timestamp),
  } as TxResponse;
};
