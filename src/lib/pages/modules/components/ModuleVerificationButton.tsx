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
        rightIcon={<CustomIcon name="chevron-down" />}
        variant="primary"
      >
        Module verification
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<CustomIcon color="gray.600" name="plus" />}
          onClick={() => {
            navigate({
              pathname: "/modules/verify",
            });
          }}
        >
          Submit module verification
        </MenuItem>
        <MenuItem
          icon={<CustomIcon color="gray.600" name="list" />}
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
