import { EmptyState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesTableWithWallet } from "./CodesTableWithWallet";

interface MyStoredCodesTableProps {
  codes: CodeInfo[];
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  emptyMessage: string;
  disconnectedMessage: string;
  isSearching: boolean;
  isReadOnly?: boolean;
}

export const MyStoredCodesTable = ({
  codes,
  isLoading,
  onRowSelect,
  emptyMessage,
  disconnectedMessage,
  isSearching,
  isReadOnly = false,
}: MyStoredCodesTableProps) => (
  <CodesTableWithWallet
    codes={codes}
    isLoading={isLoading}
    emptyState={
      <EmptyState
        my={0}
        imageVariant={isSearching ? "not-found" : "empty"}
        message={isSearching ? "No matched codes found" : emptyMessage}
        withBorder
      />
    }
    onRowSelect={onRowSelect}
    disconnectedMessage={disconnectedMessage}
    isReadOnly={isReadOnly}
  />
);
