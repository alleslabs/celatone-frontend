import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const ModuleVerificationButton = () => {
  const navigate = useInternalNavigate();
  return (
    <Menu placement="top-end">
      <MenuButton
        as={Button}
        mb={8}
        minW={52}
        variant="primary"
        rightIcon={<CustomIcon name="chevron-down" />}
      >
        Module Verification
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<CustomIcon name="plus" color="gray.600" />}
          onClick={() => {
            navigate({
              pathname: "/modules/verify",
            });
          }}
        >
          Submit Module Verification
        </MenuItem>
        <MenuItem
          icon={<CustomIcon name="list" color="gray.600" />}
          onClick={() => {
            navigate({
              pathname: "/my-module-verifications",
            });
          }}
        >
          See My Past Verification
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
