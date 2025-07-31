import type { EvmDebugTraceResponse } from "lib/services/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
import { useMemo } from "react";

import { TableContainer } from "../tableComponents";
import { EvmInternalTransactionsTableHeader } from "./EvmInternalTransactionsTableHeader";
import { EvmInternalTransactionTableRow } from "./EvmInternalTransactionsTableRow";

interface EvmInternalTransactionsTableProps {
  internalTxs: EvmDebugTraceResponse;
  showParentHash?: boolean;
}

export const EvmInternalTransactionsTable = ({
  internalTxs,
  showParentHash = true,
}: EvmInternalTransactionsTableProps) => {
  const isMobile = useMobile();
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  const templateColumns = [
    showParentHash ? "180px" : "",
    "200px",
    "40px",
    "200px",
    "minmax(200px, 1fr)",
    "120px",
    "100px",
    "60px",
  ].join(" ");

  const row = useMemo(
    () =>
      internalTxs?.map((result, index) => (
        <EvmInternalTransactionTableRow
          key={`${result.txHash ?? "nested"}-${index}`}
          assetInfos={assetInfos}
          evmDenom={evmParams?.params.feeDenom}
          result={result.result}
          showParentHash={showParentHash}
          templateColumns={templateColumns}
          txHash={result.txHash}
        />
      )),
    [internalTxs, assetInfos, evmParams, showParentHash, templateColumns]
  );

  if (isEvmParamsLoading) return <Loading />;

  return isMobile ? null : (
    <TableContainer>
      <EvmInternalTransactionsTableHeader
        showParentHash={showParentHash}
        templateColumns={templateColumns}
      />
      {row}
    </TableContainer>
  );
};
