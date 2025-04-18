import type { CodeInfo, Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { ErrorFetching } from "lib/components/state";
import { useWasmVerifyInfos } from "lib/services/verification/wasm";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { CodesTableHeader } from "./CodesTableHeader";
import { CodesTableMobileCard } from "./CodesTableMobileCard";
import { CodesTableRow } from "./CodesTableRow";

interface CodesTableProps {
  codes: Option<CodeInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  onRowSelect: (codeId: number) => void;
  isReadOnly?: boolean;
  showCw2andContracts?: boolean;
  disablePermission?: boolean;
}

export const CodesTable = ({
  codes,
  disablePermission = false,
  emptyState,
  isLoading,
  isReadOnly = false,
  onRowSelect,
  showCw2andContracts = true,
}: CodesTableProps) => {
  const isMobile = useMobile();
  const { data: wasmVerifyInfos, isLoading: isWasmVerifyInfosLoading } =
    useWasmVerifyInfos(codes?.map((code) => code.id) ?? [], !!codes);

  if (isLoading || isWasmVerifyInfosLoading) return <Loading />;
  if (!codes) return <ErrorFetching dataName="codes" />;
  if (!codes.length) return emptyState;

  const templateColumns = `max(100px) minmax(250px, 1fr)${showCw2andContracts ? " minmax(200px, 1fr) max(100px)" : ""}${!disablePermission ? ` max(160px) 150px${!isReadOnly ? " 180px" : ""}` : "2fr"}`;

  return isMobile ? (
    <MobileTableContainer>
      {codes.map((code) => (
        <CodesTableMobileCard
          key={code.id + code.uploader + code.name}
          codeInfo={code}
          showCw2andContracts={showCw2andContracts}
          wasmVerifyInfo={wasmVerifyInfos?.[code.id]}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer pb={6}>
      <CodesTableHeader
        disablePermission={disablePermission}
        isReadOnly={isReadOnly}
        showCw2andContracts={showCw2andContracts}
        templateColumns={templateColumns}
      />
      {codes.map((code) => (
        <CodesTableRow
          key={code.id + code.uploader + code.name}
          codeInfo={code}
          disablePermission={disablePermission}
          isReadOnly={isReadOnly}
          showCw2andContracts={showCw2andContracts}
          templateColumns={templateColumns}
          wasmVerifyInfo={wasmVerifyInfos?.[code.id]}
          onRowSelect={onRowSelect}
        />
      ))}
    </TableContainer>
  );
};
