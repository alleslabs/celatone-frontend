import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import type { CodeInfo, Option } from "lib/types";

import { CodesTableHeader } from "./CodesTableHeader";
import { CodesTableMobileCard } from "./CodesTableMobileCard";
import { CodesTableRow } from "./CodesTableRow";

interface CodesTableProps {
  codes: Option<CodeInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  onRowSelect: (codeId: number) => void;
  isReadOnly?: boolean;
}

export const CodesTable = ({
  codes,
  isLoading,
  emptyState,
  onRowSelect,
  isReadOnly = false,
}: CodesTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!codes?.length) return emptyState;

  const templateColumns = isReadOnly
    ? "max(100px) minmax(250px, 1fr) minmax(200px, 1fr) max(100px) max(160px) 150px"
    : "max(100px) minmax(250px, 1fr) minmax(200px, 1fr) max(100px) max(160px) 150px 180px";

  return isMobile ? (
    <MobileTableContainer>
      {codes.map((code) => (
        <CodesTableMobileCard
          key={code.id + code.uploader + code.name}
          codeInfo={code}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer pb={6}>
      <CodesTableHeader
        templateColumns={templateColumns}
        isReadOnly={isReadOnly}
      />
      {codes.map((code) => (
        <CodesTableRow
          key={code.id + code.uploader + code.name}
          codeInfo={code}
          templateColumns={templateColumns}
          onRowSelect={onRowSelect}
          isReadOnly={isReadOnly}
        />
      ))}
    </TableContainer>
  );
};
