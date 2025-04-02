import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

import { Tooltip } from "../Tooltip";
// import { useGovParams } from "lib/services/proposalService";
// import { AccessConfigPermission } from "lib/types";

export const NewProposalButton = () => {
  const navigate = useInternalNavigate();
  const govConfig = useGovConfig({ shouldRedirect: false });
  // const { data: govParams } = useGovParams();
  // const isPermissionless =
  //   !govParams || govParams.uploadAccess.permission === AccessConfigPermission.EVERYBODY;

  if (govConfig.enabled && govConfig.hideOpenProposal) return null;

  const disableWhitelist =
    (govConfig.enabled && govConfig.disableWhitelistProposal) ?? false;
  const disableStoreCode =
    (govConfig.enabled && govConfig.disableStoreCodeProposal) ?? false;

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<CustomIcon name="chevron-down" />}
        variant="primary"
        onClick={() => track(AmpEvent.USE_CREATE_NEW_PROPOSAL)}
      >
        Create New Proposal
      </MenuButton>
      <MenuList flexDirection="column">
        <Tooltip hidden={!disableStoreCode} label="Coming soon!">
          <MenuItem
            icon={<CustomIcon color="gray.600" name="code" />}
            isDisabled={disableStoreCode}
            onClick={() => {
              navigate({
                pathname: "/proposals/store-code",
              });
            }}
          >
            To Store Code
          </MenuItem>
        </Tooltip>
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
        {/* <Tooltip
          label={
            isPermissionless
              ? "Not available in permissionless network"
              : undefined
          }
        > */}
        <Tooltip hidden={!disableWhitelist} label="Coming soon!">
          <MenuItem
            icon={<CustomIcon color="gray.600" name="admin" />}
            isDisabled={disableWhitelist}
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
