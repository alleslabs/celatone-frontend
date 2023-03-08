import {
  Button,
  chakra,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { CustomIcon } from "../icon";
import { ClearAdminModal } from "../modal/contract/ClearAdmin";
import { useInternalNavigate } from "lib/app-provider";
import type { Addr, ContractAddr, Option } from "lib/types";

const StyledMenuItem = chakra(MenuItem, {
  baseStyle: {
    fontSize: "14px",
  },
});

interface AdminButtonProps {
  contractAddress: ContractAddr;
  admin: Option<Addr>;
}

export const AdminButton = ({ contractAddress, admin }: AdminButtonProps) => {
  const { address } = useWallet();
  const navigate = useInternalNavigate();

  const isAdmin = !!address && address === admin;
  return (
    <Menu>
      <Tooltip
        hasArrow
        label="You don't have admin access to this contract."
        placement="top"
        bg="honeydew.darker"
        arrowSize={8}
        isDisabled={isAdmin}
      >
        <MenuButton
          variant="outline-gray"
          as={Button}
          isDisabled={!isAdmin}
          rightIcon={<CustomIcon name="chevron-down" />}
        >
          Admin
        </MenuButton>
      </Tooltip>
      <MenuList>
        <StyledMenuItem
          icon={<CustomIcon name="migrate" />}
          onClick={() => {
            navigate({
              pathname: "/migrate",
              query: { contract: contractAddress },
            });
          }}
        >
          Migrate
        </StyledMenuItem>
        <StyledMenuItem
          icon={<CustomIcon name="admin" />}
          onClick={() => {
            navigate({
              pathname: "/admin",
              query: { contract: contractAddress },
            });
          }}
        >
          Update Admin
        </StyledMenuItem>
        <ClearAdminModal
          contractAddress={contractAddress}
          triggerElement={
            <StyledMenuItem icon={<CustomIcon name="admin-clear" />}>
              Clear Admin
            </StyledMenuItem>
          }
        />
      </MenuList>
    </Menu>
  );
};
