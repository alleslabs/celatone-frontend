import { Box, Heading, HStack } from "@chakra-ui/react";

import { MySavedCodesTable } from "lib/components/table";
import type { CodeInfo } from "lib/types";

import { SaveCodeButton } from "./SaveCodeButton";

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
  <Box mb={8}>
    <HStack alignItems="center" justifyContent="space-between" mb="18px">
      <Heading as="h6" variant="h6">
        My Saved Codes
      </Heading>
      <SaveCodeButton />
    </HStack>
    <MySavedCodesTable
      codes={codes}
      isLoading={isLoading}
      onRowSelect={onRowSelect}
      emptyMessage="Codes saved using Celatone will display here. Saved codes are stored locally on your device."
      isSearching={isSearching}
    />
  </Box>
);
