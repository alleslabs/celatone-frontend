import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { CodeInfo, Option } from "lib/types";

import { CodesTableHeader } from "./CodesTableHeader";
import { CodesTableRow } from "./CodesTableRow";

interface CodesTableProps {
  codes: Option<CodeInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const CodesTable = ({
  codes,
  isLoading,
  emptyState,
}: CodesTableProps) => {
  if (isLoading) return <Loading />;
  if (!codes?.length) return emptyState;

  const templateColumns =
    "max(80px) minmax(320px, 1fr) max(120px) max(160px) minmax(320px, 0.75fr)";

  return (
    <TableContainer>
      <CodesTableHeader templateColumns={templateColumns} />
      {codes.map((code) => (
        <CodesTableRow
          key={code.id + code.uploader + code.name}
          codeInfo={code}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
