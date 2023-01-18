import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Button,
  Icon,
  Menu,
  MenuList,
  MenuButton,
  MenuDivider,
  chakra,
  MenuItem,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  MdMoreHoriz,
  MdMode,
  MdOutlineBookmark,
  MdDelete,
  MdPersonRemove,
} from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  AddToOtherList,
  EditContractDetails,
  RemoveContract,
} from "lib/components/modal/contract";
import { ClearAdminContract } from "lib/components/modal/contract/ClearAdminContract";
import { useAdminByContractAddresses } from "lib/services/contractService";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

import { ContractNameCell } from "./table/ContractNameCell";
import { TagsCell } from "./table/TagsCell";

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  },
});

interface ContractListTableProps {
  contracts: ContractLocalInfo[];
  contractRemovalInfo?: LVPair;
}

export const ContractListTable = ({
  contracts = [],
  contractRemovalInfo,
}: ContractListTableProps) => {
  const router = useRouter();
  const { address } = useWallet();
  const { data: admins = {} } = useAdminByContractAddresses(
    contracts.map((contract) => contract.contractAddress)
  );

  return (
    <TableContainer w="full">
      <Table variant="simple" sx={{ tableLayout: "auto" }}>
        <Thead>
          <Tr
            sx={{
              "& th:first-of-type": { pl: "48px" },
              "> th": { borderColor: "divider.main" },
            }}
          >
            <Th width="15%">Contract Address</Th>
            <Th width="25%">Contract Name</Th>
            <Th width="25%">Tags</Th>
            <Th width="25%">Instantiator</Th>
            <Th width="10%" />
          </Tr>
        </Thead>
        <Tbody>
          {contracts.map((item) => (
            <Tr
              transition="all .25s ease-in-out"
              _hover={{ bg: "gray.900" }}
              cursor="pointer"
              onClick={() =>
                router.push({ pathname: `/contract/${item.contractAddress}` })
              }
              key={
                item.name +
                item.contractAddress +
                item.description +
                item.tags +
                item.lists
              }
              sx={{
                "& td:first-of-type": { pl: "48px" },
                "& td:last-of-type": { pr: "48px" },
                "> td": { borderColor: "divider.main" },
              }}
            >
              <Td>
                <ExplorerLink
                  value={item.contractAddress}
                  type="contract_address"
                  canCopyWithHover
                />
              </Td>
              <Td>
                <ContractNameCell contractLocalInfo={item} />
              </Td>
              <Td>
                <TagsCell contractLocalInfo={item} />
              </Td>
              {/* Instantiator */}
              <Td>
                <ExplorerLink
                  value={item.instantiator}
                  type="user_address"
                  canCopyWithHover
                />
              </Td>
              <Td>
                <Flex
                  gap={3}
                  justifyContent="flex-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={`/execute?contract=${item.contractAddress}`}>
                    <Button variant="outline-gray" size="sm">
                      Execute
                    </Button>
                  </Link>
                  <Link href={`/query?contract=${item.contractAddress}`}>
                    <Button variant="outline-gray" size="sm">
                      Query
                    </Button>
                  </Link>
                  <Menu>
                    <MenuButton
                      size="sm"
                      variant="ghost-gray"
                      focusBorderColor="primary.main"
                      as={Button}
                    >
                      <StyledIcon
                        as={MdMoreHoriz}
                        color="gray.600"
                        boxSize="6"
                      />
                    </MenuButton>
                    <MenuList>
                      <EditContractDetails
                        contractLocalInfo={item}
                        triggerElement={
                          <MenuItem
                            icon={<StyledIcon as={MdMode} color="gray.600" />}
                          >
                            Edit details
                          </MenuItem>
                        }
                      />
                      <AddToOtherList
                        contractLocalInfo={item}
                        triggerElement={
                          <MenuItem
                            icon={
                              <StyledIcon
                                as={MdOutlineBookmark}
                                color="gray.600"
                              />
                            }
                          >
                            Add or remove from other lists
                          </MenuItem>
                        }
                      />
                      <ClearAdminContract
                        contractAddress={item.contractAddress}
                        triggerElement={
                          <MenuItem
                            icon={
                              <StyledIcon
                                as={MdPersonRemove}
                                color="gray.600"
                              />
                            }
                            isDisabled={
                              !address ||
                              address !== admins[item.contractAddress]
                            }
                          >
                            Clear Admin
                          </MenuItem>
                        }
                      />
                      {!!contractRemovalInfo && (
                        <>
                          <MenuDivider />
                          <RemoveContract
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
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
