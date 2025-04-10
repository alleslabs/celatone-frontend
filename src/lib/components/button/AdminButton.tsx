import type { BechAddr, BechAddr32, Nullable } from "lib/types";

import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";

import { CustomIcon } from "../icon";
import { ClearAdminModal } from "../modal/contract/ClearAdmin";
import { Tooltip } from "../Tooltip";

interface AdminButtonProps {
  contractAddress: BechAddr32;
  admin: Nullable<BechAddr>;
}

export const AdminButton = ({ contractAddress, admin }: AdminButtonProps) => {
  const { address } = useCurrentChain();
  const navigate = useInternalNavigate();

  const isAdmin = !!address && address === admin;
  return (
    <Menu>
      <Tooltip
        hidden={isAdmin}
        label="You don't have admin access to this contract."
      >
        <MenuButton
          as={Button}
          isDisabled={!isAdmin}
          rightIcon={<CustomIcon name="chevron-down" />}
          size={{ base: "sm", md: "md" }}
          variant="outline-gray"
        >
          Admin
        </MenuButton>
      </Tooltip>
      <MenuList>
        <MenuItem
          icon={<CustomIcon color="gray.600" name="migrate" />}
          onClick={() => {
            navigate({
              pathname: "/migrate",
              query: { contract: contractAddress },
            });
          }}
        >
          Migrate
        </MenuItem>
        <MenuItem
          icon={<CustomIcon color="gray.600" name="admin" />}
          onClick={() => {
            navigate({
              pathname: "/admin",
              query: { contract: contractAddress },
            });
          }}
        >
          Update admin
        </MenuItem>
        <ClearAdminModal
          contractAddress={contractAddress}
          triggerElement={
            <MenuItem icon={<CustomIcon color="gray.600" name="admin-clear" />}>
              Clear admin
            </MenuItem>
          }
        />
      </MenuList>
    </Menu>
  );
};
