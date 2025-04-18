import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const ModuleVerificationButton = () => {
  const navigate = useInternalNavigate();
  return (
    <Menu placement="top-end">
      <MenuButton
        mb={8}
        variant="primary"
        as={Button}
        rightIcon={<CustomIcon name="chevron-down" />}
        minW={52}
      >
        Module verification
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
          Submit module verification
        </MenuItem>
        <MenuItem
          icon={<CustomIcon name="list" color="gray.600" />}
          onClick={() => {
            navigate({
              pathname: "/my-module-verifications",
            });
          }}
        >
          See my past verification
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
