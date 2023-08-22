import { MyStoredCodesTable } from "lib/components/table";
import type { CodeInfo } from "lib/types";

interface MyStoredCodesSectionProps {
  codes: CodeInfo[];
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  disconnectedMessage: string;
  isSearching: boolean;
}

export const MyStoredCodesSection = ({
  codes,
  isLoading,
  onRowSelect,
  disconnectedMessage,
  isSearching,
}: MyStoredCodesSectionProps) => {
  return (
    <MyStoredCodesTable
      codes={codes}
      isLoading={isLoading}
      onRowSelect={onRowSelect}
      emptyMessage="Your uploaded Wasm files will display as My Stored Codes."
      disconnectedMessage={disconnectedMessage}
      isSearching={isSearching}
    />
  );
};
