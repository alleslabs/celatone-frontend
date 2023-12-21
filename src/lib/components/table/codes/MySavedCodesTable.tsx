import { EmptyState, SavedCodeZeroState } from "lib/components/state";
import { SaveCodeButton } from "lib/pages/saved-codes/components/SaveCodeButton";
import type { CodeInfo } from "lib/types";

import { CodesTable } from "./CodesTable";

interface MySavedCodesTableProps {
  codes: CodeInfo[];
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  isSearching: boolean;
  isReadOnly?: boolean;
}

export const MySavedCodesTable = ({
  codes,
  isLoading,
  onRowSelect,
  isSearching,
  isReadOnly = false,
}: MySavedCodesTableProps) => (
  <CodesTable
    codes={codes}
    isLoading={isLoading}
    emptyState={
      isSearching || isReadOnly ? (
        <EmptyState
          imageVariant={isSearching ? "not-found" : "empty"}
          message={
            isReadOnly && !isSearching
              ? "You don’t have any saved codes."
              : "No matching code found. Make sure you are searching with code id or code name"
          }
          withBorder={!isReadOnly}
        />
      ) : (
        <SavedCodeZeroState button={<SaveCodeButton />} />
      )
    }
    onRowSelect={onRowSelect}
    isReadOnly={isReadOnly}
  />
);
