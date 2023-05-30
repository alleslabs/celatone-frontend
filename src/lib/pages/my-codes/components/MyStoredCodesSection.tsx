import { Box, Heading, HStack } from "@chakra-ui/react";

import { MyStoredCodesTable } from "lib/components/table";
import type { CodeInfo } from "lib/types";

import { UploadButton } from "./UploadButton";

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
}: MyStoredCodesSectionProps) => (
  <Box mb={8}>
    <HStack alignItems="center" justifyContent="space-between" mb={4}>
      <Heading as="h6" variant="h6">
        My Stored Codes
      </Heading>
      <UploadButton />
    </HStack>
    <MyStoredCodesTable
      codes={codes}
      isLoading={isLoading}
      onRowSelect={onRowSelect}
      emptyMessage="Your uploaded Wasm files will display as My Stored Codes."
      disconnectedMessage={disconnectedMessage}
      isSearching={isSearching}
    />
  </Box>
);
