import {
  Button,
  chakra,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

const StyledMenuItem = chakra(MenuItem, {
  baseStyle: {
    fontSize: "14px",
  },
});

export const NewProposalButton = () => {
  const navigate = useInternalNavigate();

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
        <StyledMenuItem
          icon={<CustomIcon name="code" />}
          // TODO - Change navigation path
          onClick={() => {
            navigate({
              pathname: "/proposal-storecode",
            });
          }}
        >
          To Store Code
        </StyledMenuItem>
        <StyledMenuItem
          icon={<CustomIcon name="contract-address" />}
          onClick={() => {
            // TODO - Change navigation path
            navigate({
              pathname: "/proposal-instantiate",
            });
          }}
        >
          To Instantiate Contract
        </StyledMenuItem>
        <StyledMenuItem
          icon={<CustomIcon name="admin" />}
          onClick={() => {
            // TODO - Change navigation path
            navigate({
              pathname: "/proposal-whitelisting",
            });
          }}
        >
          To Whitelisting
        </StyledMenuItem>
      </MenuList>
    </Menu>
  );
};
