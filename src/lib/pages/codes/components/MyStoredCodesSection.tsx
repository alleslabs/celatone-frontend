import { Box, Flex, Heading, HStack } from "@chakra-ui/react";

import { useCurrentNetwork } from "lib/app-provider";
import { MyStoredCodesTable } from "lib/components/table";
import type { CodeInfo } from "lib/types";

import { DeployButton } from "./DeployButton";
import { ProposalButton } from "./ProposalButton";
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
}: MyStoredCodesSectionProps) => {
  const { isMainnet } = useCurrentNetwork();

  return (
    <Box mb={8}>
      <HStack alignItems="center" justifyContent="space-between" mb="18px">
        <Heading as="h6" variant="h6">
          My Stored Codes
        </Heading>
        <Flex gap={2}>
          {isMainnet ? (
            <>
              <UploadButton />
              <ProposalButton />
            </>
          ) : (
            <DeployButton />
          )}
        </Flex>
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
};
