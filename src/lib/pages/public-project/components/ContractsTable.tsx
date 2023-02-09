import { InfoIcon } from "@chakra-ui/icons";
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
  Box,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";
import { MdSearchOff } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import type { Contract } from "lib/types";

interface ContractsTableProps {
  contracts: Contract[];
  hasSearchInput?: boolean;
}

export const ContractsTable = ({
  contracts = [],
  hasSearchInput = true,
}: ContractsTableProps) => {
  const navigate = useInternalNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredContracts = useMemo(() => {
    return matchSorter(contracts, searchKeyword, {
      keys: ["name", "contractAddress", "description"],
    });
  }, [contracts, searchKeyword]);

  return (
    <Box>
      {hasSearchInput && (
        <Flex px="12">
          <TextInput
            variant="floating"
            value={searchKeyword}
            setInputState={setSearchKeyword}
            placeholder="Search with contract address, name, or description"
            size="md"
            mb={6}
          />
        </Flex>
      )}
      {!filteredContracts.length ? (
        <Flex my={8}>
          <EmptyState message="No contract found." icon={MdSearchOff} />
        </Flex>
      ) : (
        <TableContainer w="full">
          <Table variant="simple" sx={{ tableLayout: "auto" }}>
            <Thead>
              <Tr
                sx={{
                  "& th:first-of-type": { pl: "48px" },
                  "> th": {
                    borderColor: "pebble.700",
                    textTransform: "capitalize",
                  },
                }}
              >
                <Th width="25%">Contract Address</Th>
                <Th width="30%">Contract Name</Th>

                <Th width="25%">Instantiated by</Th>
                <Th width="20%" />
              </Tr>
            </Thead>
            <Tbody>
              {filteredContracts?.map((item) => (
                <Tr
                  transition="all .25s ease-in-out"
                  _hover={{ bg: "pebble.900" }}
                  key={item.name + item.contractAddress + item.description}
                  sx={{
                    "& td:first-of-type": { pl: "48px" },
                    "& td:last-of-type": { pr: "48px" },
                    "> td": { borderColor: "pebble.700" },
                  }}
                  onClick={() =>
                    navigate({ pathname: `/contract/${item.contractAddress}` })
                  }
                  cursor="pointer"
                >
                  <Td>
                    <ExplorerLink
                      value={item.contractAddress}
                      type="contract_address"
                      canCopyWithHover
                    />
                  </Td>
                  <Td>
                    <Flex position="relative">
                      <Flex alignItems="center" gap={2}>
                        <Text variant="body2" zIndex="1">
                          {item.name}
                        </Text>
                        {item.description && (
                          <Tooltip
                            hasArrow
                            label={item.description}
                            bg="honeydew.darker"
                            placement="top"
                          >
                            <InfoIcon
                              color="pebble.600"
                              boxSize="14px"
                              cursor="pointer"
                            />
                          </Tooltip>
                        )}
                      </Flex>
                    </Flex>
                  </Td>
                  {/* TODO Instantiator Info */}
                  <Td>
                    <Text>TODO</Text>
                  </Td>
                  <Td>
                    <Flex gap={3} justifyContent="flex-end" alignItems="center">
                      <AppLink
                        href={`/execute?contract=${item.contractAddress}`}
                      >
                        <Button variant="outline-gray" size="sm">
                          Execute
                        </Button>
                      </AppLink>
                      <AppLink href={`/query?contract=${item.contractAddress}`}>
                        <Button variant="outline-gray" size="sm">
                          Query
                        </Button>
                      </AppLink>
                      {/* TODO save contract */}
                      {/* <AddToOtherList
                        contractInfo={item}
                        triggerElement={
                          <Icon
                            as={MdBookmarkBorder}
                            boxSize={6}
                            color="pebble.600"
                            cursor="pointer"
                          />
                        }
                      /> */}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
