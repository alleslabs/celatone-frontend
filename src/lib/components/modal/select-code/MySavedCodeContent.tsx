import { EmptyState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesTableReadOnly } from "./CodesTableReadOnly";

interface MySavedCodeContentProps {
  handleSelect: (code: string) => void;
  savedCodes: CodeInfo[];
}

export const MySavedCodeContent = ({
  handleSelect,
  savedCodes,
}: MySavedCodeContentProps) =>
  !savedCodes.length ? (
    <EmptyState
      message="You don’t have any saved codes in this device."
      withBorder
    />
  ) : (
    <CodesTableReadOnly onCodeSelect={handleSelect} codes={savedCodes} />
  );
