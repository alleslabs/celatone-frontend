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

import { ContractName } from "./table/ContractNameCell";
import { Tags } from "./table/TagsCell";

const iconProps = {
  boxSize: "4",
  display: "flex",
  alignItems: "center",
};

interface ContractListProps {
  contracts: ContractInfo[];
  isContractRemovable?: Option;
}
export const ContractList = ({
  contracts = [],
  isContractRemovable,
}: ContractListProps) => {
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
            <Th width="30%">Contract Name</Th>
            <Th width="25%">Tags</Th>
            <Th width="20%">Instantiator</Th>
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
                item.address +
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
                  value={item.address}
                  type="contract_address"
                  canCopy
                />
              </Td>
              <Td>
                <ContractName contractInfo={item} />
              </Td>
              <Td>
                <Tags contractInfo={item} />
              </Td>
              {/* Instantiator */}
              {/* TODO: check if address match wallet address => show 'Me' instead */}
              <Td>
                <ExplorerLink
                  value={item.instantiator}
                  type="user_address"
                  canCopy
                />
              </Td>
              <Td>
                <Flex gap={3} justifyContent="flex-end">
                  <Link href={`/execute?contract=${item.address}`}>
                    <Button variant="outline-gray" size="sm">
                      Execute
                    </Button>
                  </Link>
                  <Link href={`/query?contract=${item.address}`}>
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
