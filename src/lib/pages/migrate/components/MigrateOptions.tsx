import type { UploadAccessParams } from "lib/services/types";
import type { Option } from "lib/types";

import { Alert, AlertDescription, Flex, Heading } from "@chakra-ui/react";
import { useCelatoneApp, useCurrentChain } from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { CustomIcon } from "lib/components/icon";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { resolvePermission } from "lib/utils";

interface MigrateOptionsProps {
  existHandler: () => void;
  isAdmin: boolean;
  uploadAccessParams: Option<UploadAccessParams>;
  uploadHandler: () => void;
}

export const MigrateOptions = ({
  existHandler,
  isAdmin,
  uploadAccessParams,
  uploadHandler,
}: MigrateOptionsProps) => {
  const { address } = useCurrentChain();
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();
  const isAllowed =
    !uploadAccessParams?.isPermissionedNetwork ||
    resolvePermission(
      address,
      uploadAccessParams?.codeUploadAccess.permission,
      uploadAccessParams?.codeUploadAccess.addresses
    );
  return (
    <>
      <Flex alignItems="center" direction="column" gap={4} mb={6}>
        <Heading as="h5" textAlign="center" variant="h5">
          Migrate options
        </Heading>
        <UserDocsLink
          cta="Read more about Migrate Contract"
          href="cosmwasm/contracts/admin-actions#migrating-a-contract"
          isDevTool
          mt={0}
        />
      </Flex>

      {address && !isAllowed && (
        <Alert alignItems="flex-start" gap={2} mb={4} variant="primary">
          <CustomIcon boxSize={4} color="primary.light" name="info-circle" />
          <AlertDescription>{`${chainPrettyName} is a permissioned CosmWasm network. Only whitelisted addresses can directly upload Wasm files.`}</AlertDescription>
        </Alert>
      )}
      <ButtonCard
        description={
          uploadAccessParams?.isPermissionedNetwork
            ? "Available for whitelisted addresses only"
            : "Deploy contract by uploading new Wasm file"
        }
        disabled={!isAdmin || !isAllowed}
        mb={4}
        title="Upload new Wasm file"
        onClick={uploadHandler}
      />
      <ButtonCard
        description="Input code ID or select from stored codes or your saved codes"
        disabled={!isAdmin}
        title="Use existing code IDs"
        onClick={existHandler}
      />
    </>
  );
};
