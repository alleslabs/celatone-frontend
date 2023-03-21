import { Loading } from "../Loading";
import { EmptyState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesReadOnlyTable } from "./CodesReadOnlyTable";

interface MySavedCodeContentProps {
  handleSelect: (code: string) => void;
  savedCodes: CodeInfo[];
  isLoading: boolean;
}

export const MySavedCodeContent = ({
  handleSelect,
  savedCodes,
  isLoading,
}: MySavedCodeContentProps) => {
  if (isLoading) return <Loading />;
  if (!savedCodes.length)
    return (
      <EmptyState
        message="You don’t have any saved codes in this device."
        withBorder
      />
    );
  return <CodesReadOnlyTable onCodeSelect={handleSelect} codes={savedCodes} />;
};
