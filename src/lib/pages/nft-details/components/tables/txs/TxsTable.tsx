import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { NftTxResponse } from "lib/services/types";
import type { Option } from "lib/types";

import { TxsTableHeader } from "./TxsTableHeader";
import { TxsTableMobileCard } from "./TxsTableMobileCard";
import { TxsTableRow } from "./TxsTableRow";

interface TxsTableProps {
  emptyState: JSX.Element;
  isLoading: boolean;
  txs: Option<NftTxResponse[]>;
}

export const TxsTable = ({ emptyState, isLoading, txs }: TxsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!txs || !txs.length) return emptyState;

  const templateColumns = `190px minmax(360px, 1fr) 280px`;

  return isMobile ? (
    <MobileTableContainer>
      {txs.map((transaction, index) => (
        <TxsTableMobileCard
          key={transaction.txhash + index.toString()}
          hash={transaction.txhash}
          {...transaction}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <TxsTableHeader templateColumns={templateColumns} />
      {txs.map((transaction, index) => (
        <TxsTableRow
          key={transaction.txhash + index.toString()}
          hash={transaction.txhash}
          templateColumns={templateColumns}
          {...transaction}
        />
      ))}
    </TableContainer>
  );
};
