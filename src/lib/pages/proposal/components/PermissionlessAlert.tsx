import { Alert, AlertDescription, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const PermissionlessAlert = () => {
  return (
    <Alert variant="error" alignItems="center" justifyContent="space-between">
      <Flex gap={2} align="center">
        <CustomIcon name="alert-circle-solid" color="error.main" boxSize={4} />
        <AlertDescription>
          You cannot create proposal to whitelist on permissionless network.
        </AlertDescription>
      </Flex>
    </Alert>
  );
};
