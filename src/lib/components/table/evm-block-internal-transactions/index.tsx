import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";
import { useDebugTraceBlockByNumber, useEvmParams } from "lib/services/evm";
import { useMemo } from "react";

import { TableContainer } from "../tableComponents";
import { EvmBlockInternalTransactionsTableHeader } from "./EvmBlockInternalTransactionsTableHeader";
import { EvmBlockInternalTransactionTableRow } from "./EvmBlockInternalTransactionsTableRow";

interface EvmInternalTransactionsTableProps {
  height: number;
}

const templateColumns =
  "160px 180px 40px 180px minmax(250px, 1fr) 120px 100px 60px";

export const EvmBlockInternalTransactionsTable = ({
  height,
}: EvmInternalTransactionsTableProps) => {
  const isMobile = useMobile();
  const { data, isLoading } = useDebugTraceBlockByNumber(height);
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  const row = useMemo(
    () =>
      data?.map((result, index) => (
        <EvmBlockInternalTransactionTableRow
          key={`${result.txHash ?? "nested"}-${index}`}
          assetInfos={assetInfos}
          evmDenom={evmParams?.params.feeDenom}
          result={result.result}
          templateColumns={templateColumns}
          txHash={result.txHash}
        />
      )),
    [data, assetInfos, evmParams]
  );

  if (isLoading || isEvmParamsLoading) return <Loading />;

  return isMobile ? null : (
    <TableContainer>
      <EvmBlockInternalTransactionsTableHeader
        templateColumns={templateColumns}
      />
      {row}
    </TableContainer>
  );
};
