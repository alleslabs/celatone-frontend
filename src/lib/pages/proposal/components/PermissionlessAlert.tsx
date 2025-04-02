import { Alert, AlertDescription, Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

export const PermissionlessAlert = () => {
  return (
    <Alert alignItems="center" justifyContent="space-between" variant="error">
      <Flex align="center" gap={2}>
        <CustomIcon
          boxSize={4}
          color="error.main"
          name="alert-triangle-solid"
        />
        <AlertDescription>
          You cannot create proposal to whitelist on permissionless network.
        </AlertDescription>
      </Flex>
    </Alert>
  );
};
