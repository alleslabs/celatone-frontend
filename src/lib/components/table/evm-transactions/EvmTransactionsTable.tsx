import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
import type { TxDataWithTimeStampJsonRpc } from "lib/services/types";
import type { Option } from "lib/types";

import { EvmTransactionsTableHeader } from "./EvmTransactionsTableHeader";
import { EvmTransactionsTableMobileCard } from "./EvmTransactionsTableMobileCard";
import { EvmTransactionsTableRow } from "./EvmTransactionsTableRow";

interface EvmTransactionsTableProps {
  evmTransactions: Option<TxDataWithTimeStampJsonRpc[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  showTimestamp?: boolean;
}

export const EvmTransactionsTable = ({
  evmTransactions,
  isLoading,
  emptyState,
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
    "32px",
    "160px",
    "48px",
    "minmax(140px, 1fr)",
    "minmax(160px, 2fr)",
    "48px",
    "minmax(180px, 2fr)",
    "minmax(250px, 1fr)",
    showTimestamp ? "minmax(247px, 1fr)" : "",
  ];
  const templateColumns: string = columns.join(" ").trim();

  return isMobile ? (
    <MobileTableContainer>
      {evmTransactions.map((evmTransaction) => (
        <EvmTransactionsTableMobileCard
          key={evmTransaction.tx.hash}
          evmTransaction={evmTransaction}
          evmDenom={evmParams?.params.fee_denom}
          assetInfos={assetInfos}
          showTimestamp={showTimestamp}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <EvmTransactionsTableHeader
        templateColumns={templateColumns}
        showTimestamp={showTimestamp}
      />
      {evmTransactions.map((evmTransaction) => (
        <EvmTransactionsTableRow
          key={evmTransaction.tx.hash}
          templateColumns={templateColumns}
          evmTransaction={evmTransaction}
          evmDenom={evmParams?.params.fee_denom}
          assetInfos={assetInfos}
          showTimestamp={showTimestamp}
        />
      ))}
    </TableContainer>
  );
};
