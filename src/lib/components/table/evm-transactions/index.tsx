import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";
import type { ReactNode } from "react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { EvmTransactionsTableHeader } from "./EvmTransactionsTableHeader";
import { EvmTransactionsTableMobileCard } from "./EvmTransactionsTableMobileCard";
import { EvmTransactionsTableRow } from "./EvmTransactionsTableRow";

interface EvmTransactionsTableProps {
  emptyState: ReactNode;
  evmTransactions: Option<TxDataWithTimeStampJsonRpc[]>;
  isLoading: boolean;
  showTimestamp?: boolean;
}

export const EvmTransactionsTable = ({
  emptyState,
  evmTransactions,
  isLoading,
  showTimestamp = false,
}: EvmTransactionsTableProps) => {
  const isMobile = useMobile();
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({
    withPrices: true,
  });

  if (isLoading || isEvmParamsLoading) return <Loading />;
  if (!evmTransactions?.length) return emptyState;

  const columns: string[] = [
    "200px",
    "minmax(180px, 1fr)",
    "160px",
    "180px",
    ...(showTimestamp ? ["minmax(247px, 1fr)"] : []),
  ];
  const templateColumns: string = columns.join(" ");

  return isMobile ? (
    <MobileTableContainer>
      {evmTransactions.map((evmTransaction) => (
        <EvmTransactionsTableMobileCard
          key={evmTransaction.tx.hash}
          assetInfos={assetInfos}
          evmDenom={evmParams?.params.feeDenom}
          evmTransaction={evmTransaction}
          showTimestamp={showTimestamp}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <EvmTransactionsTableHeader
        showTimestamp={showTimestamp}
        templateColumns={templateColumns}
      />
      {evmTransactions.map((evmTransaction) => (
        <EvmTransactionsTableRow
          key={evmTransaction.tx.hash}
          assetInfos={assetInfos}
          evmDenom={evmParams?.params.feeDenom}
          evmTransaction={evmTransaction}
          showTimestamp={showTimestamp}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
