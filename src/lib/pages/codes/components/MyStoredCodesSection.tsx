import { Box, Heading, HStack } from "@chakra-ui/react";

import { MyStoredCodesTable } from "lib/components/table";
import type { CodeInfo } from "lib/types";

import { UploadButton } from "./UploadButton";

interface MyStoredCodesSectionProps {
  codes: CodeInfo[];
  isLoading: boolean;
  onRowSelect: (codeId: number) => void;
  disconnected: string;
  isSearching: boolean;
}

export const MyStoredCodesSection = ({
  codes,
  isLoading,
  onRowSelect,
  disconnected,
  isSearching,
}: MyStoredCodesSectionProps) => (
  <Box mb={8}>
    <HStack alignItems="center" justifyContent="space-between" mb="18px">
      <Heading as="h6" variant="h6">
        My Stored Codes
      </Heading>
      <UploadButton />
    </HStack>
    <MyStoredCodesTable
      codes={codes}
      isLoading={isLoading}
      onRowSelect={onRowSelect}
      empty="Your uploaded Wasm files will display as My Stored Codes."
      disconnected={disconnected}
      isSearching={isSearching}
    />
  </Box>
);
