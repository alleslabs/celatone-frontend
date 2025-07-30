import type { EvmDebugTraceResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
import { useMemo } from "react";

import { TableContainer } from "../tableComponents";
import { EvmBlockInternalTransactionsTableHeader } from "./EvmBlockInternalTransactionsTableHeader";
import { EvmBlockInternalTransactionTableRow } from "./EvmBlockInternalTransactionsTableRow";

interface EvmInternalTransactionsTableProps {
  internalTxs: Option<EvmDebugTraceResponse>;
}

const templateColumns =
  "180px 200px 40px 200px minmax(200px, 1fr) 120px 100px 60px";

export const EvmInternalTransactionsTable = ({
  internalTxs,
}: EvmInternalTransactionsTableProps) => {
  const isMobile = useMobile();
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  const row = useMemo(
    () =>
      internalTxs?.map((result, index) => (
        <EvmBlockInternalTransactionTableRow
          key={`${result.txHash ?? "nested"}-${index}`}
          assetInfos={assetInfos}
          evmDenom={evmParams?.params.feeDenom}
          result={result.result}
          templateColumns={templateColumns}
          txHash={result.txHash}
        />
      )),
    [internalTxs, assetInfos, evmParams]
  );

  if (isEvmParamsLoading) return <Loading />;

  return isMobile ? null : (
    <TableContainer>
      <EvmBlockInternalTransactionsTableHeader
        templateColumns={templateColumns}
      />
      {row}
    </TableContainer>
  );
};
