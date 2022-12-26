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
} from "@chakra-ui/react";
import Link from "next/link";
import {
  MdMoreVert,
  MdMode,
  MdOutlineBookmark,
  MdDelete,
} from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  AddToOtherList,
  EditContract,
  RemoveContract,
} from "lib/components/modal/contract";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

import { ContractNameCell } from "./table/ContractNameCell";
import { TagsCell } from "./table/TagsCell";

const iconProps = {
  boxSize: "4",
  display: "flex",
  alignItems: "center",
};

interface ContractListTableProps {
  contracts: ContractInfo[];
  isContractRemovable?: Option;
}
export const ContractListTable = ({
  contracts = [],
  isContractRemovable,
}: ContractListTableProps) => {
  return (
    <TableContainer w="full">
      <Table variant="simple">
        <Thead>
          <Tr
            sx={{
              "& th:first-of-type": { pl: "48px" },
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
                <ContractNameCell contract={item} />
              </Td>
              <Td>
                <TagsCell contractInfo={item} />
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
                <Flex gap={3} justifyContent="flex-end">
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
                      <Icon
                        as={MdMoreVert}
                        style={iconProps}
                        color="gray.600"
                        boxSize="6"
                      />
                    </MenuButton>
                    <MenuList>
                      <EditContract
                        contractInfo={item}
                        menuItemProps={{
                          icon: (
                            <Icon
                              as={MdMode}
                              style={iconProps}
                              color="gray.600"
                            />
                          ),
                          children: "Edit details",
                        }}
                      />
                      <AddToOtherList
                        contractInfo={item}
                        menuItemProps={{
                          icon: (
                            <Icon
                              as={MdOutlineBookmark}
                              style={iconProps}
                              color="gray.600"
                            />
                          ),
                          children: "Add or remove from other lists",
                        }}
                      />
                      {isContractRemovable && (
                        <>
                          <MenuDivider />
                          <RemoveContract
                            contractInfo={item}
                            list={isContractRemovable}
                            menuItemProps={{
                              icon: (
                                <Icon
                                  as={MdDelete}
                                  style={iconProps}
                                  color="error.light"
                                />
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
