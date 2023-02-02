import { Flex } from "@chakra-ui/react";

import { EmptyState } from "lib/components/state/EmptyState";
import type { CodeInfo } from "lib/types";

import { CodeTableReadOnly } from "./CodeTableReadOnly";

interface MySavedCodeContentProps {
  handleSelect: (code: string) => void;
  savedCodes: CodeInfo[];
}

export const MySavedCodeContent = ({
  handleSelect,
  savedCodes,
}: MySavedCodeContentProps) => {
  if (savedCodes.length) {
    return <CodeTableReadOnly onCodeSelect={handleSelect} codes={savedCodes} />;
  }
  return (
    <Flex
      py="64px"
      direction="column"
      borderY="1px solid"
      borderColor="divider.main"
    >
      <EmptyState message="You don’t have any saved codes in this device." />
    </Flex>
  );
};
