import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { Message, NFTCollectionActivities } from "lib/types";

import { ActivitiesTableHeader } from "./ActivitiesTableHeader";
import { ActivitiesTableMobileCard } from "./ActivitiesTableMobileCard";
import { ActivitiesTableRow } from "./ActivitiesTableRow";

interface ActivitiesTableProps {
  activities?: NFTCollectionActivities;
  isLoading?: boolean;
  emptyState?: JSX.Element;
}

export const ActivitiesTable = ({
  activities,
  isLoading,
  emptyState,
}: ActivitiesTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!activities || !activities.collectionTransactions.length)
    return emptyState;

  const { collectionTransactions } = activities;
  const templateColumns = `190px minmax(360px, 1fr) 280px`;

  return isMobile ? (
    <MobileTableContainer>
      {collectionTransactions.map(({ transaction }) => (
        <ActivitiesTableMobileCard
          key={transaction.hash}
          hash={transaction.hash}
          timestamp={transaction.block.timestamp}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ActivitiesTableHeader templateColumns={templateColumns} />
      {collectionTransactions.map(({ transaction }) => (
        <ActivitiesTableRow
          key={transaction.hash + transaction.messages[0].type}
          hash={transaction.hash}
          messages={transaction.messages as Message[]}
          timestamp={transaction.block.timestamp}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
