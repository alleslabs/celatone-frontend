import { MySavedCodesTable } from "lib/components/table";
import type { CodeInfo } from "lib/types";

interface MySavedCodesSectionProps {
  codes: CodeInfo[];
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  isSearching: boolean;
}

export const MySavedCodesSection = ({
  codes,
  isLoading,
  onRowSelect,
  isSearching,
}: MySavedCodesSectionProps) => (
  <MySavedCodesTable
    codes={codes}
    isLoading={isLoading}
    onRowSelect={onRowSelect}
    emptyMessage="Codes saved using Celatone will display here. Saved codes are stored locally on your device."
    isSearching={isSearching}
  />
);
