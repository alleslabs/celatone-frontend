import type { RawTxResponse } from "lib/services/types";

import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";

import { getTxDecoderQueryKey } from "./queryKey";

describe("getTxDecoderQueryKey", () => {
  test("identifies a decoded transaction without hashing its response", () => {
    const rawTxResponse = {
      events: Array.from({ length: 100 }, (_, index) => ({
        attributes: [{ key: "large", value: "payload".repeat(100) }],
        type: `event-${index}`,
      })),
      txhash: "A".repeat(64),
    } as RawTxResponse;

    const queryKey = getTxDecoderQueryKey({
      defer: true,
      evmEnabled: false,
      evmJsonRpc: undefined,
      rawTxResponse,
      wasmEnabled: false,
    });

    expect(queryKey).toEqual([
      CELATONE_QUERY_KEYS.TX_DECODER,
      rawTxResponse.txhash,
      false,
      false,
      false,
      true,
    ]);
    expect(queryKey).not.toContain(rawTxResponse);
  });
});
