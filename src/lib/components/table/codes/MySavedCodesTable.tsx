import { EmptyState, SavedCodeZeroState } from "lib/components/state";
import { SaveCodeButton } from "lib/pages/saved-codes/components/SaveCodeButton";
import type { CodeInfo } from "lib/types";

import { CodesTable } from "./CodesTable";

interface MySavedCodesTableProps {
  codes: CodeInfo[];
  isLoading: boolean;
  isReadOnly?: boolean;
  onRowSelect: (codeId: number) => void;
  totalData: number;
}

export const MySavedCodesTable = ({
  codes,
  isLoading,
  isReadOnly = false,
  onRowSelect,
  totalData,
}: MySavedCodesTableProps) =>
  totalData ? (
    <CodesTable
      emptyState={
        <EmptyState
          imageVariant="not-found"
          message="No matching codes found. Make sure you are searching with Code ID or Code Name"
          my={0}
          withBorder
        />
      }
      isReadOnly={isReadOnly}
      codes={codes}
      isLoading={isLoading}
      onRowSelect={onRowSelect}
    />
  ) : (
    <>
      {isReadOnly ? (
        <EmptyState
          imageVariant="empty"
          message="You don’t have any saved codes."
          my={0}
          withBorder
        />
      ) : (
        <SavedCodeZeroState button={<SaveCodeButton />} />
      )}
    </>
  );
