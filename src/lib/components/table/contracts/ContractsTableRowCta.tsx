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

import { TableRow } from "../tableComponents";
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

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    borderRadius: "36px",
    display: "flex",
    fontSize: "22px",
  },
});

export interface CtaInfo {
  removingContractList: Option<LVPair>;
}

interface ContractsTableRowCtaProps {
  contractInfo: ContractInfo;
  showLastUpdate?: boolean;
  withCta?: CtaInfo;
}

export const ContractsTableRowCta = ({
  contractInfo,
  showLastUpdate = true,
  withCta,
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
            <Button size="sm" variant="outline-gray">
              Execute
            </Button>
          </AppLink>
          <AppLink
            href={`/interact-contract?selectedType=${ContractInteractionTabs.Query}&contract=${contractInfo.contractAddress}`}
          >
            <Button size="sm" variant="outline-gray">
              Query
            </Button>
          </AppLink>
          {isFullTier && (
            <AppLink href={`/migrate?contract=${contractInfo.contractAddress}`}>
              <Button isDisabled={!isAdmin} size="sm" variant="outline-gray">
                Migrate
              </Button>
            </AppLink>
          )}
        </Flex>
      </TableRow>
      <TableRow>
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            variant="ghost-gray"
            onClick={(e) => e.stopPropagation()}
          >
            <CustomIcon name="more" boxSize="16px" color="gray.600" />
          </MenuButton>
          <MenuList onClick={(e) => e.stopPropagation()}>
            <EditContractDetailsModal
              triggerElement={
                <MenuItem
                  icon={
                    <CustomIcon name="edit" boxSize="16px" color="gray.600" />
                  }
                >
                  Edit details
                </MenuItem>
              }
              contractLocalInfo={contractInfo}
            />
            <AddToOtherListModal
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
              contractLocalInfo={contractInfo}
            />
            {isFullTier && (
              <>
                <MenuItem
                  isDisabled={!isAdmin}
                  icon={
                    <CustomIcon name="admin" boxSize="16px" color="gray.600" />
                  }
                  onClick={() => {
                    navigate({
                      pathname: "/admin",
                      query: { contract: contractInfo.contractAddress },
                    });
                  }}
                >
                  Update Admin
                </MenuItem>
                <ClearAdminModal
                  triggerElement={
                    <MenuItem
                      isDisabled={!isAdmin}
                      icon={
                        <CustomIcon
                          name="admin-clear"
                          boxSize="16px"
                          color="gray.600"
                        />
                      }
                    >
                      Clear Admin
                    </MenuItem>
                  }
                  contractAddress={contractInfo.contractAddress}
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
                    children: "Remove from this list",
                    icon: <CustomIcon name="delete" color="error.light" />,
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
            gap={1}
            cursor="text"
            direction="column"
            onClick={(e) => e.stopPropagation()}
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
              triggerElement={
                <StyledIconButton
                  aria-label="button"
                  variant="ghost-primary"
                  icon={<CustomIcon name="bookmark-solid" />}
                />
              }
              contractLocalInfo={contractInfo}
            />
          ) : (
            <SaveContractDetailsModal
              triggerElement={
                <StyledIconButton
                  aria-label="button"
                  variant="ghost-gray"
                  icon={<CustomIcon name="bookmark" />}
                />
              }
              contractLocalInfo={contractInfo}
            />
          )}
        </Box>
      </TableRow>
    </>
  );
};
