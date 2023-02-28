import { Heading } from "@chakra-ui/react";

import { ButtonCard } from "lib/components/ButtonCard";

interface MigrateOptionsProps {
  isAdmin: boolean;
  uploadHandler: () => void;
  existHandler: () => void;
}

export const MigrateOptions = ({
  isAdmin,
  uploadHandler,
  existHandler,
}: MigrateOptionsProps) => (
  <>
    <Heading as="h5" variant="h5" mb="24px" textAlign="center">
      Migrate Options
    </Heading>
    <ButtonCard
      disabled={!isAdmin}
      title="Upload new WASM File"
      description="Deploy contract by uploading new Wasm file"
      onClick={uploadHandler}
      mb="16px"
    />
    <ButtonCard
      disabled={!isAdmin}
      title="Use existing Code IDs"
      description="Input code ID or select from stored codes or your saved codes"
      onClick={existHandler}
    />
  </>
);
