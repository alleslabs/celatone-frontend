import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { NftTransactionPagination } from "lib/services/nft";

import { TxsTableHeader } from "./TxsTableHeader";
import { TxsTableMobileCard } from "./TxsTableMobileCard";
import { TxsTableRow } from "./TxsTableRow";

interface TxsTableProps {
  txs?: NftTransactionPagination[];
  isLoading?: boolean;
  emptyState?: JSX.Element;
}

export const TxsTable = ({ txs, isLoading, emptyState }: TxsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!txs || !txs.length) return emptyState;

  const templateColumns = `190px minmax(360px, 1fr) 280px`;

  return isMobile ? (
    <MobileTableContainer>
      {txs.map((transaction, key) => {
        const arrayKey = transaction.txhash + key;
        return (
          <TxsTableMobileCard
            key={arrayKey}
            hash={transaction.txhash}
            {...transaction}
          />
        );
      })}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <TxsTableHeader templateColumns={templateColumns} />
      {txs.map((transaction, key) => {
        const arrayKey = transaction.txhash + key;
        return (
          <TxsTableRow
            key={arrayKey}
            hash={transaction.txhash}
            templateColumns={templateColumns}
            {...transaction}
          />
        );
      })}
    </TableContainer>
  );
};
