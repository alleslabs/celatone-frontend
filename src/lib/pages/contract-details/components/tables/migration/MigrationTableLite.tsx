import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { MobileTableContainer, TableContainer } from "lib/components/table";
import { useMigrationHistoriesRest } from "lib/pages/contract-details/data";
import { useWasmVerifyInfos } from "lib/services/verification/wasm";
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
  const { data, error, isLoading } = useMigrationHistoriesRest(contractAddress);
  const { data: wasmVerifyInfos, isLoading: isWasmVerifyInfosLoading } =
    useWasmVerifyInfos(data?.map((history) => history.codeId) ?? [], !!data);

  const templateColumns = "90px 320px minmax(140px, 1fr)";

  if (isLoading || isWasmVerifyInfosLoading) return <Loading />;
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
          {data.map((history, index) => (
            <MigrationMobileCard
              key={`${index.toString()}-${history.codeId}`}
              history={history}
              wasmVerifyInfo={wasmVerifyInfos?.[history.codeId]}
            />
          ))}
        </MobileTableContainer>
      ) : (
        <TableContainer>
          <MigrationHeader templateColumns={templateColumns} />
          {data.map((history, index) => (
            <MigrationRow
              key={`${index.toString()}-${history.codeId}`}
              history={history}
              templateColumns={templateColumns}
              wasmVerifyInfo={wasmVerifyInfos?.[history.codeId]}
            />
          ))}
        </TableContainer>
      )}
    </>
  );
};
