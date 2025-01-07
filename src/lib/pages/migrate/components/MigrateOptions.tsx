import { Alert, AlertDescription, Flex, Heading } from "@chakra-ui/react";

import { useCelatoneApp, useCurrentChain } from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { CustomIcon } from "lib/components/icon";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { UploadAccessParams } from "lib/services/types";
import type { Option } from "lib/types";
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
      uploadAccessParams?.permission,
      uploadAccessParams?.addresses
    );
  return (
    <>
      <Flex alignItems="center" gap={4} mb={6} direction="column">
        <Heading as="h5" textAlign="center" variant="h5">
          Migrate Options
        </Heading>
        <UserDocsLink
          cta="Read more about Migrate Contract"
          mt={0}
          isDevTool
          href="cosmwasm/contracts/admin-actions#migrating-a-contract"
        />
      </Flex>

      {address && !isAllowed && (
        <Alert alignItems="flex-start" gap={2} mb={4} variant="primary">
          <CustomIcon name="info-circle" boxSize={4} color="primary.light" />
          <AlertDescription>{`${chainPrettyName} is a permissioned CosmWasm network. Only whitelisted addresses can directly upload Wasm files.`}</AlertDescription>
        </Alert>
      )}
      <ButtonCard
        disabled={!isAdmin || !isAllowed}
        mb={4}
        title="Upload new WASM File"
        description={
          uploadAccessParams?.isPermissionedNetwork
            ? "Available for whitelisted addresses only"
            : "Deploy contract by uploading new Wasm file"
        }
        onClick={uploadHandler}
      />
      <ButtonCard
        disabled={!isAdmin}
        title="Use existing Code IDs"
        description="Input code ID or select from stored codes or your saved codes"
        onClick={existHandler}
      />
    </>
  );
};
