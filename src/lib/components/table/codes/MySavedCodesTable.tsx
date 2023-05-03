import { EmptyState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesTable } from "./CodesTable";

interface MySavedCodesTableProps {
  codes: CodeInfo[];
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  emptyMessage: string;
  isSearching: boolean;
  isReadOnly?: boolean;
}

export const MySavedCodesTable = ({
  codes,
  isLoading,
  onRowSelect,
  emptyMessage,
  isSearching,
  isReadOnly = false,
}: MySavedCodesTableProps) => (
  <CodesTable
    codes={codes}
    isLoading={isLoading}
    emptyState={
      <EmptyState
        imageVariant={isSearching ? "not-found" : "empty"}
        message={isSearching ? "No matched codes found" : emptyMessage}
      />
    }
    onRowSelect={onRowSelect}
    isReadOnly={isReadOnly}
  />
);
