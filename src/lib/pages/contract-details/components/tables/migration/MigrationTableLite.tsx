import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import { useMigrationHistoriesLcd } from "lib/pages/contract-details/data";
import type { BechAddr32 } from "lib/types";

import { MigrationHeader } from "./MigrationHeader";
import { MigrationMobileCard } from "./MigrationMobileCard";
import { MigrationRow } from "./MigrationRow";

interface MigrationTableLiteProps {
  contractAddress: BechAddr32;
}

export const MigrationTableLite = ({
  contractAddress,
}: MigrationTableLiteProps) => {
  const isMobile = useMobile();
  const { data, error, isLoading } = useMigrationHistoriesLcd(contractAddress);

  const templateColumns = "90px 320px 140px";

  if (isLoading) return <Loading />;
  if (error) return <ErrorFetching dataName="migration histories" />;
  if (!data?.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="This contract does not have any migration history yet."
        withBorder
      />
    );

  return (
    <>
      {isMobile ? (
        <MobileTableContainer>
          {data.map((history) => (
            <MigrationMobileCard key={history.codeId} history={history} />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <MigrationHeader templateColumns={templateColumns} />
          {data.map((history) => (
            <MigrationRow
              key={history.codeId}
              history={history}
              templateColumns={templateColumns}
            />
          ))}
        </TableContainer>
      )}
    </>
  );
};
