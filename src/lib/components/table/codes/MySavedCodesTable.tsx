import { EmptyState, SavedCodeZeroState } from "lib/components/state";
import { SaveCodeButton } from "lib/pages/saved-codes/components/SaveCodeButton";
import type { CodeInfo } from "lib/types";

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
      isLoading={isLoading}
      emptyState={
        <EmptyState
          my={0}
          imageVariant="not-found"
          message="No matching codes found. Make sure you are searching with code ID or code name"
          withBorder
        />
      }
      onRowSelect={onRowSelect}
      isReadOnly={isReadOnly}
      showCw2andContracts={showCw2andContracts}
      disablePermission={disablePermission}
    />
  ) : (
    <>
      {isReadOnly ? (
        <EmptyState
          my={0}
          imageVariant="empty"
          message="You don’t have any saved codes."
          withBorder
        />
      ) : (
        <SavedCodeZeroState button={<SaveCodeButton />} />
      )}
    </>
  );
