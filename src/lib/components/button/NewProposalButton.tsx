import {
  Button,
  chakra,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import { TooltipComponent } from "../TooltipComponent";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { useGovParams } from "lib/services/proposalService";
import { AccessConfigPermission } from "lib/types";

const StyledMenuItem = chakra(MenuItem, {
  baseStyle: {
    fontSize: "14px",
  },
});

export const NewProposalButton = () => {
  const navigate = useInternalNavigate();
  const { data: govParams } = useGovParams();
  const isPermissionless =
    govParams?.uploadAccess.permission === AccessConfigPermission.EVERYBODY;
  return (
    <Menu>
      <MenuButton
        variant="primary"
        color="text.main"
        as={Button}
        rightIcon={<CustomIcon name="chevron-down" color="text.main" />}
      >
        Create New Proposal
      </MenuButton>
      <MenuList>
        {/* <StyledMenuItem
          icon={<CustomIcon name="code" />}
          // TODO - Change navigation path
          onClick={() => {
            navigate({
              pathname: "/proposal-storecode",
            });
          }}
        >
          To Store Code
        </StyledMenuItem> */}
        {/* <StyledMenuItem
          icon={<CustomIcon name="contract-address" />}
          onClick={() => {
            // TODO - Change navigation path
            navigate({
              pathname: "/proposal-instantiate",
            });
          }}
        >
          To Instantiate Contract
        </StyledMenuItem> */}
        <TooltipComponent
          label={
            isPermissionless
              ? "Not available in permissionless network"
              : undefined
          }
        >
          <StyledMenuItem
            isDisabled={isPermissionless}
            icon={<CustomIcon name="admin" />}
            onClick={() => {
              navigate({
                pathname: "/proposal/whitelist",
              });
            }}
          >
            To Whitelist
          </StyledMenuItem>
        </TooltipComponent>
      </MenuList>
    </Menu>
  );
};
