import { EmptyState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesTableWithWallet } from "./CodesTableWithWallet";

interface MyStoredCodesTableProps {
  codes: CodeInfo[];
  disconnectedMessage: string;
  emptyMessage: string;
  isLoading: boolean;
  isReadOnly?: boolean;
  onRowSelect: (codeId: number) => void;
  totalData: number;
}

export const MyStoredCodesTable = ({
  codes,
  disconnectedMessage,
  emptyMessage,
  isLoading,
  isReadOnly = false,
  onRowSelect,
  totalData,
}: MyStoredCodesTableProps) => (
  <CodesTableWithWallet
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
    isReadOnly={isReadOnly}
    codes={codes}
    disconnectedMessage={disconnectedMessage}
    isLoading={isLoading}
    onRowSelect={onRowSelect}
  />
);
