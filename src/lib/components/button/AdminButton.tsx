import {
  Button,
  chakra,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import {
  MdKeyboardArrowDown,
  MdPerson,
  MdPersonRemove,
  MdReadMore,
} from "react-icons/md";

import { ClearAdminContract } from "../modal/contract/ClearAdminContract";
import { useInternalNavigate } from "lib/app-provider";
import type { ContractAddr, HumanAddr, Option } from "lib/types";

const StyledMenuItem = chakra(MenuItem, {
  baseStyle: {
    fontSize: "14px",
  },
});

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  },
});

interface AdminButtonProps {
  contractAddress: ContractAddr;
  admin: Option<HumanAddr | ContractAddr>;
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
          rightIcon={<Icon as={MdKeyboardArrowDown} boxSize="18px" />}
        >
          Admin
        </MenuButton>
      </Tooltip>
      <MenuList>
        <StyledMenuItem
          icon={<StyledIcon as={MdReadMore} color="gray.600" />}
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
          icon={<StyledIcon as={MdPerson} color="gray.600" />}
          onClick={() => {
            navigate({
              pathname: "/admin",
              query: { contract: contractAddress },
            });
          }}
        >
          Update Admin
        </StyledMenuItem>
        <ClearAdminContract
          contractAddress={contractAddress}
          triggerElement={
            <StyledMenuItem
              icon={<StyledIcon as={MdPersonRemove} color="gray.600" />}
            >
              Clear Admin
            </StyledMenuItem>
          }
        />
      </MenuList>
    </Menu>
  );
};
