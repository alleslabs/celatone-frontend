import { EmptyState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesTable } from "./CodesTable";

interface MySavedCodesTableProps {
  codes: CodeInfo[];
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  empty: string;
  isSearching: boolean;
  isReadOnly?: boolean;
}

export const MySavedCodesTable = ({
  codes,
  isLoading,
  onRowSelect,
  empty,
  isSearching,
  isReadOnly = false,
}: MySavedCodesTableProps) => (
  <CodesTable
    codes={codes}
    isLoading={isLoading}
    emptyState={
      <EmptyState
        imageVariant={isSearching ? "not-found" : "empty"}
        message={isSearching ? "No matched codes found" : empty}
        withBorder
      />
    }
    onRowSelect={onRowSelect}
    isReadOnly={isReadOnly}
  />
);
