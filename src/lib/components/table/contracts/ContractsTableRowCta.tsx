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

import {
  useCurrentChain,
  useInternalNavigate,
  useTierConfig,
} from "lib/app-provider";
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
import { ContractInteractionTabs } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";
import { TableRow } from "../tableComponents";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

export interface CtaInfo {
  removingContractList: Option<LVPair>;
}

interface ContractsTableRowCtaProps {
  contractInfo: ContractInfo;
  withCta?: CtaInfo;
  showLastUpdate?: boolean;
}

export const ContractsTableRowCta = ({
  contractInfo,
  withCta,
  showLastUpdate = true,
}: ContractsTableRowCtaProps) => {
  const { address } = useCurrentChain();
  const { isFullTier } = useTierConfig();
  const navigate = useInternalNavigate();

  const isAdmin = !!address && address === contractInfo.admin;
  return withCta ? (
    <>
      <TableRow>
        <Flex
          gap={3}
          justifyContent="flex-end"
          onClick={(e) => e.stopPropagation()}
        >
          <AppLink
            href={`/interact-contract?selectedType=${ContractInteractionTabs.Execute}&contract=${contractInfo.contractAddress}`}
          >
            <Button variant="outline-gray" size="sm">
              Execute
            </Button>
          </AppLink>
          <AppLink
            href={`/interact-contract?selectedType=${ContractInteractionTabs.Query}&contract=${contractInfo.contractAddress}`}
          >
            <Button variant="outline-gray" size="sm">
              Query
            </Button>
          </AppLink>
          {isFullTier && (
            <AppLink href={`/migrate?contract=${contractInfo.contractAddress}`}>
              <Button variant="outline-gray" size="sm" isDisabled={!isAdmin}>
                Migrate
              </Button>
            </AppLink>
          )}
        </Flex>
      </TableRow>
      <TableRow>
        <Menu>
          <MenuButton
            size="sm"
            variant="ghost-gray"
            as={Button}
            onClick={(e) => e.stopPropagation()}
          >
            <CustomIcon name="more" boxSize="16px" color="gray.600" />
          </MenuButton>
          <MenuList onClick={(e) => e.stopPropagation()}>
            <EditContractDetailsModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <MenuItem
                  icon={
                    <CustomIcon name="edit" boxSize="16px" color="gray.600" />
                  }
                >
                  Edit details
                </MenuItem>
              }
            />
            <AddToOtherListModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <MenuItem
                  icon={
                    <CustomIcon
                      name="bookmark"
                      boxSize="16px"
                      color="gray.600"
                    />
                  }
                >
                  Add or remove from lists
                </MenuItem>
              }
            />
            {isFullTier && (
              <>
                <MenuItem
                  icon={
                    <CustomIcon name="admin" boxSize="16px" color="gray.600" />
                  }
                  onClick={() => {
                    navigate({
                      pathname: "/admin",
                      query: { contract: contractInfo.contractAddress },
                    });
                  }}
                  isDisabled={!isAdmin}
                >
                  Update Admin
                </MenuItem>
                <ClearAdminModal
                  contractAddress={contractInfo.contractAddress}
                  triggerElement={
                    <MenuItem
                      icon={
                        <CustomIcon
                          name="admin-clear"
                          boxSize="16px"
                          color="gray.600"
                        />
                      }
                      isDisabled={!isAdmin}
                    >
                      Clear Admin
                    </MenuItem>
                  }
                />
              </>
            )}
            {!!withCta.removingContractList && (
              <>
                <MenuDivider />
                <RemoveContractModal
                  contractLocalInfo={contractInfo}
                  contractRemovalInfo={withCta.removingContractList}
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
      {showLastUpdate && (
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
                <Text variant="body3" color="text.dark">
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
      )}
      <TableRow>
        <Box onClick={(e) => e.stopPropagation()}>
          {contractInfo.lists ? (
            <AddToOtherListModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledIconButton
                  aria-label="button"
                  icon={<CustomIcon name="bookmark-solid" />}
                  variant="ghost-primary"
                />
              }
            />
          ) : (
            <SaveContractDetailsModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledIconButton
                  aria-label="button"
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
