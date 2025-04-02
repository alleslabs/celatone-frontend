import type { CodeInfo } from "lib/types";

import { EmptyState, SavedCodeZeroState } from "lib/components/state";
import { SaveCodeButton } from "lib/pages/saved-codes/components/SaveCodeButton";

import { CodesTable } from "./CodesTable";

interface MySavedCodesTableProps {
  codes: CodeInfo[];
  totalData: number;
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  isReadOnly?: boolean;
  showCw2andContracts?: boolean;
  disablePermission?: boolean;
}

export const MySavedCodesTable = ({
  codes,
  totalData,
  isLoading,
  onRowSelect,
  isReadOnly = false,
  showCw2andContracts = true,
  disablePermission = false,
}: MySavedCodesTableProps) =>
  totalData ? (
    <CodesTable
      codes={codes}
      disablePermission={disablePermission}
      emptyState={
        <EmptyState
          imageVariant="not-found"
          message="No matching codes found. Make sure you are searching with Code ID or Code Name"
          my={0}
          withBorder
        />
      }
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      showCw2andContracts={showCw2andContracts}
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
