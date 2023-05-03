import {
  Button,
  chakra,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import { Tooltip } from "../TooltipComponent";
import { useCurrentNetwork, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

const StyledMenuItem = chakra(MenuItem, {
  baseStyle: {
    fontSize: "14px",
  },
});

export const NewProposalButton = () => {
  const navigate = useInternalNavigate();
  const { isTestnet } = useCurrentNetwork();

  return (
    <Menu>
      <MenuButton
        variant="primary"
        color="text.main"
        as={Button}
        rightIcon={<CustomIcon name="chevron-down" />}
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
        <Tooltip label={isTestnet ? "Not available in testnet" : undefined}>
          <StyledMenuItem
            isDisabled={isTestnet}
            icon={<CustomIcon name="admin" />}
            onClick={() => {
              navigate({
                pathname: "/proposal/whitelist",
              });
            }}
          >
            To Whitelist
          </StyledMenuItem>
        </Tooltip>
      </MenuList>
    </Menu>
  );
};
