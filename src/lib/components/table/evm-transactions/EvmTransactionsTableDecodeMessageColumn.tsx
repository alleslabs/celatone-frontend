import type { DecodedEthereumTx } from "@initia/tx-decoder";
import type { EvmVerifyInfosResponse } from "lib/services/types";
import type { HexAddr20, Nullable, Option } from "lib/types";

import { Spinner } from "@chakra-ui/react";
import { DecodeCosmosEvmMessageHeader } from "lib/components/decode-message/evm-message";
import { EvmMethodChip } from "lib/components/EvmMethodChip";

interface EvmTransactionsTableDecodeMessageColumnProps {
  decodedTx: Option<DecodedEthereumTx>;
  evmVerifyInfos: Option<Nullable<EvmVerifyInfosResponse>>;
  isDecodedTxFetching: boolean;
  txInput: string;
  txTo: HexAddr20 | null;
}

const DecodeMessageColumn = ({
  decodedTx,
  evmVerifyInfos,
  txInput,
  txTo,
}: Omit<
  EvmTransactionsTableDecodeMessageColumnProps,
  "isDecodedTxFetching"
>) => {
  if (decodedTx) {
    return (
      <DecodeCosmosEvmMessageHeader
        compact
        evmDecodedMessage={decodedTx}
        evmVerifyInfos={evmVerifyInfos}
        log={undefined}
        msgCount={1}
      />
    );
  }

  return <EvmMethodChip txInput={txInput} txTo={txTo} width="auto" />;
};

export const EvmTransactionsTableDecodeMessageColumn = ({
  decodedTx,
  evmVerifyInfos,
  isDecodedTxFetching,
  txInput,
  txTo,
}: EvmTransactionsTableDecodeMessageColumnProps) => {
  return isDecodedTxFetching ? (
    <Spinner boxSize={4} />
  ) : (
    <DecodeMessageColumn
      decodedTx={decodedTx}
      evmVerifyInfos={evmVerifyInfos}
      txInput={txInput}
      txTo={txTo}
    />
  );
};
