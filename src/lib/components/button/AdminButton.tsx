import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { ClearAdminModal } from "../modal/contract/ClearAdmin";
import { Tooltip } from "../Tooltip";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import type { BechAddr, BechAddr32, Nullable } from "lib/types";

interface AdminButtonProps {
  admin: Nullable<BechAddr>;
  contractAddress: BechAddr32;
}

export const AdminButton = ({ admin, contractAddress }: AdminButtonProps) => {
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
          size={{ base: "sm", md: "md" }}
          variant="outline-gray"
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
          triggerElement={
            <MenuItem icon={<CustomIcon name="admin-clear" color="gray.600" />}>
              Clear Admin
            </MenuItem>
          }
          contractAddress={contractAddress}
        />
      </MenuList>
    </Menu>
  );
};
