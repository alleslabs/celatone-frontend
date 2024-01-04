import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import type { Activity } from "lib/services/collection";
import type { HexAddr } from "lib/types";

import { ActivitiesTableHeader } from "./ActivitiesTableHeader";
import { ActivitiesTableMobileCard } from "./ActivitiesTableMobileCard";
import { ActivitiesTableRow } from "./ActivitiesTableRow";

interface ActivitiesTableProps {
  collectionAddress: HexAddr;
  activities?: Activity[];
  isLoading?: boolean;
  emptyState?: JSX.Element;
}

export const ActivitiesTable = ({
  collectionAddress,
  activities,
  isLoading,
  emptyState,
}: ActivitiesTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!activities || !activities.length) return emptyState;

  const templateColumns = `190px 200px minmax(360px, 1fr) 280px`;

  return isMobile ? (
    <MobileTableContainer>
      {activities.map((activity, key) => {
        const arrayKey = key + activity.txhash;
        return (
          <ActivitiesTableMobileCard
            key={arrayKey}
            collectionAddress={collectionAddress}
            activity={activity}
          />
        );
      })}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <ActivitiesTableHeader templateColumns={templateColumns} />
      {activities.map((activity, key) => {
        const arrayKey = key + activity.txhash;
        return (
          <ActivitiesTableRow
            key={arrayKey}
            collectionAddress={collectionAddress}
            activity={activity}
            templateColumns={templateColumns}
          />
        );
      })}
    </TableContainer>
  );
};
