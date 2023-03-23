import {
  Box,
  Button,
  chakra,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { TableRow } from "../tableComponents";
import { useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import {
  AddToOtherListModal,
  ClearAdminModal,
  EditContractDetailsModal,
  RemoveContractModal,
  SaveContractDetailsModal,
} from "lib/components/modal";
import type { ContractInfo, LVPair, Option } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

const StyledMenuItem = chakra(MenuItem, {
  baseStyle: {
    fontSize: "14px",
  },
});

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

export interface CTAInfo {
  removingContractList: Option<LVPair>;
}

interface ContractsTableRowCTAProps {
  contractInfo: ContractInfo;
  withCTA?: CTAInfo;
}

export const ContractsTableRowCTA = ({
  contractInfo,
  withCTA,
}: ContractsTableRowCTAProps) => {
  const { address } = useWallet();
  const navigate = useInternalNavigate();

  const isAdmin = !!address && address === contractInfo.admin;
  return withCTA ? (
    <>
      <TableRow>
        <Flex
          gap={3}
          justifyContent="flex-end"
          onClick={(e) => e.stopPropagation()}
        >
          <AppLink href={`/execute?contract=${contractInfo.contractAddress}`}>
            <Button variant="outline-gray" size="sm">
              Execute
            </Button>
          </AppLink>
          <AppLink href={`/query?contract=${contractInfo.contractAddress}`}>
            <Button variant="outline-gray" size="sm">
              Query
            </Button>
          </AppLink>
          <AppLink href={`/migrate?contract=${contractInfo.contractAddress}`}>
            <Button variant="outline-gray" size="sm" isDisabled={!isAdmin}>
              Migrate
            </Button>
          </AppLink>
        </Flex>
      </TableRow>

      <TableRow>
        <Menu>
          <MenuButton size="sm" variant="ghost-gray" as={Button}>
            <CustomIcon name="more" boxSize="16px" />
          </MenuButton>
          <MenuList>
            <EditContractDetailsModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledMenuItem
                  icon={<CustomIcon name="edit" boxSize="16px" />}
                >
                  Edit details
                </StyledMenuItem>
              }
            />
            <AddToOtherListModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledMenuItem
                  icon={<CustomIcon name="bookmark" boxSize="16px" />}
                >
                  Add or remove from other lists
                </StyledMenuItem>
              }
            />
            <StyledMenuItem
              icon={<CustomIcon name="admin" boxSize="16px" />}
              onClick={() => {
                navigate({
                  pathname: "/admin",
                  query: { contract: contractInfo.contractAddress },
                });
              }}
              isDisabled={!isAdmin}
            >
              Update Admin
            </StyledMenuItem>
            <ClearAdminModal
              contractAddress={contractInfo.contractAddress}
              triggerElement={
                <StyledMenuItem
                  icon={<CustomIcon name="admin-clear" boxSize="16px" />}
                  isDisabled={!isAdmin}
                >
                  Clear Admin
                </StyledMenuItem>
              }
            />
            {!!withCTA.removingContractList && (
              <>
                <MenuDivider />
                <RemoveContractModal
                  contractLocalInfo={contractInfo}
                  contractRemovalInfo={withCTA.removingContractList}
                  menuItemProps={{
                    icon: <CustomIcon name="delete" color="error.light" />,
                    children: "Remove from this list",
                  }}
                />
              </>
            )}
          </MenuList>
        </Menu>
      </TableRow>
    </>
  ) : (
    <>
      <TableRow>
        <Flex
          direction="column"
          gap={1}
          onClick={(e) => e.stopPropagation()}
          cursor="text"
        >
          {contractInfo.latestUpdated ? (
            <>
              <Text variant="body2">
                {formatUTC(contractInfo.latestUpdated)}
              </Text>
              <Text variant="body2" color="text.dark">
                {`(${dateFromNow(contractInfo.latestUpdated)})`}
              </Text>
            </>
          ) : (
            <Text variant="body2" color="text.dark">
              N/A
            </Text>
          )}
        </Flex>
      </TableRow>

      <TableRow>
        <Box onClick={(e) => e.stopPropagation()}>
          {contractInfo.lists ? (
            <AddToOtherListModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledIconButton
                  icon={
                    <CustomIcon name="bookmark-solid" color="violet.light" />
                  }
                  variant="ghost-gray"
                />
              }
            />
          ) : (
            <SaveContractDetailsModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledIconButton
                  icon={<CustomIcon name="bookmark" />}
                  variant="ghost-gray"
                />
              }
            />
          )}
        </Box>
      </TableRow>
    </>
  );
};
