import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { Tooltip } from "../Tooltip";
import { useCurrentNetwork, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

export const NewProposalButton = () => {
  const navigate = useInternalNavigate();
  const { isTestnet } = useCurrentNetwork();

  return (
    <Menu>
      <MenuButton
        onClick={() => AmpTrack(AmpEvent.USE_CREATE_NEW_PROPOSAL)}
        variant="primary"
        as={Button}
        rightIcon={<CustomIcon name="chevron-down" />}
      >
        Create New Proposal
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<CustomIcon name="code" color="gray.600" />}
          onClick={() => {
            navigate({
              pathname: "/proposals/store-code",
            });
          }}
        >
          To Store Code
        </MenuItem>
        {/* <MenuItem
          icon={<CustomIcon name="contract-address" color="gray.600"/>}
          onClick={() => {
            navigate({
              pathname: "/proposals/instantiate",
            });
          }}
        >
          To Instantiate Contract
        </MenuItem> */}
        <Tooltip
          label={isTestnet ? "Not available in testnet" : undefined}
          placement="left"
        >
          <MenuItem
            isDisabled={isTestnet}
            icon={<CustomIcon name="admin" color="gray.600" />}
            onClick={() => {
              navigate({
                pathname: "/proposals/whitelist",
              });
            }}
          >
            To Whitelist
          </MenuItem>
        </Tooltip>
      </MenuList>
    </Menu>
  );
};
