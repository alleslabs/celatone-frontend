import type { CodeInfo } from "lib/types";

import { EmptyState } from "lib/components/state";

import { CodesTableWithWallet } from "./CodesTableWithWallet";

interface MyStoredCodesTableProps {
  codes: CodeInfo[];
  totalData: number;
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  emptyMessage: string;
  disconnectedMessage: string;
  isReadOnly?: boolean;
}

export const MyStoredCodesTable = ({
  codes,
  totalData,
  isLoading,
  onRowSelect,
  emptyMessage,
  disconnectedMessage,
  isReadOnly = false,
}: MyStoredCodesTableProps) => (
  <CodesTableWithWallet
    codes={codes}
    disconnectedMessage={disconnectedMessage}
    emptyState={
      <EmptyState
        imageVariant={totalData ? "not-found" : "empty"}
        message={
          totalData
            ? "No matched codes found. Make sure you are searching with Code ID or Code Name"
            : emptyMessage
        }
        my={0}
        withBorder
      />
    }
    isLoading={isLoading}
    isReadOnly={isReadOnly}
    onRowSelect={onRowSelect}
  />
);
