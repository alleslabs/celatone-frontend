import { EmptyState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesTableWithWallet } from "./CodesTableWithWallet";

interface MyStoredCodesTableProps {
  codes: CodeInfo[];
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  empty: string;
  disconnected: string;
  isSearching: boolean;
  isReadOnly?: boolean;
}

export const MyStoredCodesTable = ({
  codes,
  isLoading,
  onRowSelect,
  empty,
  disconnected,
  isSearching,
  isReadOnly = false,
}: MyStoredCodesTableProps) => (
  <CodesTableWithWallet
    codes={codes}
    isLoading={isLoading}
    emptyState={
      <EmptyState
        message={isSearching ? "No matched codes found" : empty}
        withBorder
      />
    }
    onRowSelect={onRowSelect}
    disconnected={disconnected}
    isReadOnly={isReadOnly}
  />
);
