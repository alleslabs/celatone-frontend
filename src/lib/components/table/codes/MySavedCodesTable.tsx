import type { CodeInfo } from "lib/types";

import { EmptyState, SavedCodeZeroState } from "lib/components/state";
import { SaveCodeButton } from "lib/pages/saved-codes/components/SaveCodeButton";

import { CodesTable } from "./CodesTable";

interface MySavedCodesTableProps {
  codes: CodeInfo[];
  disablePermission?: boolean;
  isLoading: boolean;
  isReadOnly?: boolean;
  onRowSelect: (codeId: number) => void;
  showCw2andContracts?: boolean;
  totalData: number;
}

export const MySavedCodesTable = ({
  codes,
  disablePermission = false,
  isLoading,
  isReadOnly = false,
  onRowSelect,
  showCw2andContracts = true,
  totalData,
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
