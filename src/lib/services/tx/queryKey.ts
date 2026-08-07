import type { RawTxResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";

interface TxDecoderQueryKeyOptions {
  defer: boolean;
  evmEnabled: boolean;
  evmJsonRpc: Option<string>;
  rawTxResponse: Option<RawTxResponse>;
  wasmEnabled: boolean;
}

export const getTxDecoderQueryKey = ({
  defer,
  evmEnabled,
  evmJsonRpc,
  rawTxResponse,
  wasmEnabled,
}: TxDecoderQueryKeyOptions) =>
  [
    CELATONE_QUERY_KEYS.TX_DECODER,
    rawTxResponse?.txhash,
    evmEnabled,
    evmEnabled && evmJsonRpc,
    wasmEnabled,
    defer,
  ] as const;
