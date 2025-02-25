import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import type { BechAddr, BechAddr32, Nullable } from "lib/types";
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
        label="You don't have admin access to this contract."
        hidden={isAdmin}
      >
        <MenuButton
          variant="outline-gray"
          size={{ base: "sm", md: "md" }}
          as={Button}
          isDisabled={!isAdmin}
          rightIcon={<CustomIcon name="chevron-down" />}
        >
          Admin
        </MenuButton>
      </Tooltip>
      <MenuList>
        <MenuItem
          icon={<CustomIcon name="migrate" color="gray.600" />}
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
          icon={<CustomIcon name="admin" color="gray.600" />}
          onClick={() => {
            navigate({
              pathname: "/admin",
              query: { contract: contractAddress },
            });
          }}
        >
          Update Admin
        </MenuItem>
        <ClearAdminModal
          contractAddress={contractAddress}
          triggerElement={
            <MenuItem icon={<CustomIcon name="admin-clear" color="gray.600" />}>
              Clear Admin
            </MenuItem>
          }
        />
      </MenuList>
    </Menu>
  );
};
