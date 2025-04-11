import type { ContractInfo, LVPair, Option } from "lib/types";

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
            <CustomIcon boxSize="16px" color="gray.600" name="more" />
          </MenuButton>
          <MenuList onClick={(e) => e.stopPropagation()}>
            <EditContractDetailsModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <MenuItem
                  icon={
                    <CustomIcon boxSize="16px" color="gray.600" name="edit" />
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
                      boxSize="16px"
                      color="gray.600"
                      name="bookmark"
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
                    <CustomIcon boxSize="16px" color="gray.600" name="admin" />
                  }
                  isDisabled={!isAdmin}
                  onClick={() => {
                    navigate({
                      pathname: "/admin",
                      query: { contract: contractInfo.contractAddress },
                    });
                  }}
                >
                  Update admin
                </MenuItem>
                <ClearAdminModal
                  contractAddress={contractInfo.contractAddress}
                  triggerElement={
                    <MenuItem
                      icon={
                        <CustomIcon
                          boxSize="16px"
                          color="gray.600"
                          name="admin-clear"
                        />
                      }
                      isDisabled={!isAdmin}
                    >
                      Clear admin
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
                    icon: <CustomIcon color="error.light" name="delete" />,
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
            cursor="text"
            direction="column"
            gap={1}
            onClick={(e) => e.stopPropagation()}
          >
            {contractInfo.latestUpdated ? (
              <>
                <Text variant="body2">
                  {formatUTC(contractInfo.latestUpdated)}
                </Text>
                <Text color="text.dark" variant="body3">
                  {`(${dateFromNow(contractInfo.latestUpdated)})`}
                </Text>
              </>
            ) : (
              <Text color="text.dark" variant="body2">
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
