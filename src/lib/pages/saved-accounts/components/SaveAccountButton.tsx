import { Button } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { SaveNewAccountModal } from "lib/components/modal";

export const SaveAccountButton = () => (
  <SaveNewAccountModal
    trigger={
      <Button
        as="button"
        children="Save new account"
        leftIcon={<CustomIcon name="bookmark" />}
        variant="outline-primary"
      />
    }
  />
);
