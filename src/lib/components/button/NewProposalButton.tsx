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
        onClick={() => track(AmpEvent.USE_CREATE_NEW_PROPOSAL)}
        variant="primary"
        as={Button}
        rightIcon={<CustomIcon name="chevron-down" />}
      >
        Create new proposal
      </MenuButton>
      <MenuList flexDirection="column">
        <Tooltip label="Coming soon!" hidden={!disableStoreCode}>
          <MenuItem
            isDisabled={disableStoreCode}
            icon={<CustomIcon name="code" color="gray.600" />}
            onClick={() => {
              navigate({
                pathname: "/proposals/store-code",
              });
            }}
          >
            To store code
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
          To instantiate contract
        </MenuItem> */}
        {/* <Tooltip
          label={
            isPermissionless
              ? "Not available in permissionless network"
              : undefined
          }
        > */}
        <Tooltip label="Coming soon!" hidden={!disableWhitelist}>
          <MenuItem
            isDisabled={disableWhitelist}
            icon={<CustomIcon name="admin" color="gray.600" />}
            onClick={() => {
              navigate({
                pathname: "/proposals/whitelist",
              });
            }}
          >
            To whitelist
          </MenuItem>
        </Tooltip>
      </MenuList>
    </Menu>
  );
};
