import { Box, Heading, HStack } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { MyStoredCodesTable } from "lib/components/table";
import { useUploadAccessParams } from "lib/services/proposalService";
import type { Addr, CodeInfo } from "lib/types";
import { AccessConfigPermission } from "lib/types";

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
  const { data } = useUploadAccessParams();
  const { address } = useWallet();
  const isAllowed = Boolean(data?.addresses?.includes(address as Addr));

  const isPermissionedNetwork =
    data?.permission !== AccessConfigPermission.EVERYBODY;

  return (
    <Box mb={8}>
      <HStack alignItems="center" justifyContent="space-between" mb="18px">
        <Heading as="h6" variant="h6">
          My Stored Codes
        </Heading>
        {/* TODO: overwrite this logic when merging proposal feature */}
        <UploadButton isAllowed={!isPermissionedNetwork || isAllowed} />
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
