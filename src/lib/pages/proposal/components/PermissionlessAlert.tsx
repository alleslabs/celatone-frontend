import { Alert, AlertDescription, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const PermissionlessAlert = () => {
  return (
    <Alert alignItems="center" variant="error" justifyContent="space-between">
      <Flex align="center" gap={2}>
        <CustomIcon
          name="alert-triangle-solid"
          boxSize={4}
          color="error.main"
        />
        <AlertDescription>
          You cannot create proposal to whitelist on permissionless network.
        </AlertDescription>
      </Flex>
    </Alert>
  );
};
