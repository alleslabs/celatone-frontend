import {
  Flex,
  Button,
  Icon,
  Menu,
  MenuList,
  MenuButton,
  MenuDivider,
  chakra,
  MenuItem,
  Grid,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import {
  MdMoreHoriz,
  MdMode,
  MdOutlineBookmark,
  MdDelete,
  MdPersonRemove,
  MdPerson,
} from "react-icons/md";

import { useInternalNavigate, useGetAddressType } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  ClearAdminModal,
  AddToOtherListModal,
  EditContractDetailsModal,
  RemoveContractModal,
} from "lib/components/modal";
import {
  ContractNameCell,
  TableContainer,
  TableHeaderNoBorder,
  TableRowNoBorder,
  TagsCell,
} from "lib/components/table";
import { useAdminByContractAddresses } from "lib/services/contractService";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

const StyledMenuItem = chakra(MenuItem, {
  baseStyle: {
    fontSize: "14px",
  },
});

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  },
});

const TEMPLATE_COLUMNS = "160px minmax(300px, 3fr) minmax(200px, 2fr) 460px";

interface ContractListTableProps {
  contracts: ContractLocalInfo[];
  contractRemovalInfo?: LVPair;
}

export const ContractListTable = ({
  contracts = [],
  contractRemovalInfo,
}: ContractListTableProps) => {
  const navigate = useInternalNavigate();
  const getAddressType = useGetAddressType();
  const { address } = useWallet();
  const { data: admins = {} } = useAdminByContractAddresses(
    contracts.map((contract) => contract.contractAddress)
  );

  return (
    <TableContainer position="relative" overflow="visible">
      <Grid
        minW="min-content"
        templateColumns={TEMPLATE_COLUMNS}
        px="48px"
        borderBottom="1px solid"
        borderColor="pebble.700"
      >
        <TableHeaderNoBorder>Contract Address</TableHeaderNoBorder>
        <TableHeaderNoBorder>Contract Name</TableHeaderNoBorder>
        <TableHeaderNoBorder>Tags</TableHeaderNoBorder>
        <TableHeaderNoBorder>Instantiator</TableHeaderNoBorder>
      </Grid>
      {contracts.map((item) => {
        const isAdmin = address && address === admins[item.contractAddress];
        return (
          <Grid
            _hover={{ bg: "pebble.900" }}
            transition="all .25s ease-in-out"
            cursor="pointer"
            onClick={() =>
              navigate({ pathname: `/contract/${item.contractAddress}` })
            }
            key={
              item.name +
              item.contractAddress +
              item.description +
              item.tags +
              item.lists
            }
            px="48px"
            minW="min-content"
            templateColumns={TEMPLATE_COLUMNS}
            borderBottom="1px solid"
            borderColor="pebble.700"
          >
            <TableRowNoBorder>
              <ExplorerLink
                value={item.contractAddress}
                type="contract_address"
                canCopyWithHover
              />
            </TableRowNoBorder>
            <TableRowNoBorder>
              <ContractNameCell contractLocalInfo={item} />
            </TableRowNoBorder>
            <TableRowNoBorder>
              <TagsCell contractLocalInfo={item} />
            </TableRowNoBorder>
            <TableRowNoBorder>
              <Flex justify="space-between" w="full">
                {item.instantiator ? (
                  <ExplorerLink
                    value={item.instantiator}
                    type={getAddressType(item.instantiator)}
                    canCopyWithHover
                  />
                ) : (
                  <Text variant="body2" color="text.dark">
                    N/A
                  </Text>
                )}
                <Flex
                  gap={3}
                  justifyContent="flex-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AppLink href={`/execute?contract=${item.contractAddress}`}>
                    <Button variant="outline-gray" size="sm">
                      Execute
                    </Button>
                  </AppLink>
                  <AppLink href={`/query?contract=${item.contractAddress}`}>
                    <Button variant="outline-gray" size="sm">
                      Query
                    </Button>
                  </AppLink>
                  <AppLink href={`/migrate?contract=${item.contractAddress}`}>
                    <Button
                      variant="outline-gray"
                      size="sm"
                      isDisabled={!isAdmin}
                    >
                      Migrate
                    </Button>
                  </AppLink>
                  <Menu>
                    <MenuButton size="sm" variant="ghost-gray" as={Button}>
                      <StyledIcon
                        as={MdMoreHoriz}
                        color="pebble.600"
                        boxSize="6"
                      />
                    </MenuButton>
                    <MenuList>
                      <EditContractDetailsModal
                        contractLocalInfo={item}
                        triggerElement={
                          <StyledMenuItem
                            icon={<StyledIcon as={MdMode} color="pebble.600" />}
                          >
                            Edit details
                          </StyledMenuItem>
                        }
                      />
                      <AddToOtherListModal
                        contractLocalInfo={item}
                        triggerElement={
                          <StyledMenuItem
                            icon={
                              <StyledIcon
                                as={MdOutlineBookmark}
                                color="pebble.600"
                              />
                            }
                          >
                            Add or remove from other lists
                          </StyledMenuItem>
                        }
                      />
                      <StyledMenuItem
                        icon={<StyledIcon as={MdPerson} color="pebble.600" />}
                        onClick={() => {
                          navigate({
                            pathname: "/admin",
                            query: { contract: item.contractAddress },
                          });
                        }}
                        isDisabled={!isAdmin}
                      >
                        Update Admin
                      </StyledMenuItem>
                      <ClearAdminModal
                        contractAddress={item.contractAddress}
                        triggerElement={
                          <StyledMenuItem
                            icon={
                              <StyledIcon
                                as={MdPersonRemove}
                                color="pebble.600"
                              />
                            }
                            isDisabled={!isAdmin}
                          >
                            Clear Admin
                          </StyledMenuItem>
                        }
                      />
                      {!!contractRemovalInfo && (
                        <>
                          <MenuDivider />
                          <RemoveContractModal
                            contractLocalInfo={item}
                            contractRemovalInfo={contractRemovalInfo}
                            menuItemProps={{
                              icon: (
                                <StyledIcon as={MdDelete} color="error.light" />
                              ),
                              children: "Remove from this list",
                            }}
                          />
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>
            </TableRowNoBorder>
          </Grid>
        );
      })}
    </TableContainer>
  );
};
