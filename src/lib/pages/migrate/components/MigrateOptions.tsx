import { Alert, AlertDescription, Heading } from "@chakra-ui/react";

import { useCelatoneApp, useCurrentChain } from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { CustomIcon } from "lib/components/icon";
import type { UploadAccess } from "lib/services/proposal";
import type { HumanAddr, Option } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { resolvePermission } from "lib/utils";

interface MigrateOptionsProps {
  isAdmin: boolean;
  uploadAccess: Option<UploadAccess>;
  uploadHandler: () => void;
  existHandler: () => void;
}

export const MigrateOptions = ({
  isAdmin,
  uploadAccess,
  uploadHandler,
  existHandler,
}: MigrateOptionsProps) => {
  const { address } = useCurrentChain();
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();
  const isPermissionedNetwork =
    uploadAccess?.permission !== AccessConfigPermission.EVERYBODY;
  const isAllowed = resolvePermission(
    address as HumanAddr,
    uploadAccess?.permission,
    uploadAccess?.addresses
  );
  return (
    <>
      <Heading as="h5" variant="h5" mb={6} textAlign="center">
        Migrate Options
      </Heading>
      {address && !isAllowed && (
        <Alert variant="primary" mb={4} alignItems="flex-start" gap={2}>
          <CustomIcon
            name="info-circle-solid"
            color="primary.light"
            boxSize={4}
          />
          <AlertDescription>{`${chainPrettyName} is a permissioned CosmWasm network. Only whitelisted addresses can directly upload Wasm files.`}</AlertDescription>
        </Alert>
      )}
      <ButtonCard
        disabled={!isAdmin || !isAllowed}
        title="Upload new WASM File"
        description={
          isPermissionedNetwork
            ? "Available for whitelisted addresses only"
            : "Deploy contract by uploading new Wasm file"
        }
        onClick={uploadHandler}
        mb={4}
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
