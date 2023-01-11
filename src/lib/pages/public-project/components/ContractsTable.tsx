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
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import type { Contract } from "lib/services/publicProject";

interface ContractsTableProps {
  contracts: Contract[];
  hasSearchInput?: boolean;
}

export const ContractsTable = ({
  contracts = [],
  hasSearchInput = true,
}: ContractsTableProps) => {
  const router = useRouter();
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
            label="Search with contract address or contract description"
            size="md"
            mb={6}
          />
        </Flex>
      )}
      {filteredContracts.length === 0 ? (
        <Flex my={8}>
          <EmptyState message="No matched contract found." />
        </Flex>
      ) : (
        <TableContainer w="full">
          <Table variant="simple" sx={{ tableLayout: "auto" }}>
            <Thead>
              <Tr
                sx={{
                  "& th:first-of-type": { pl: "48px" },
                  "> th": {
                    borderColor: "divider.main",
                    textTransform: "capitalize",
                  },
                }}
              >
                <Th width="25%">Contract Address</Th>
                <Th width="30%">Contract Name</Th>

                <Th width="25%">Instantiator</Th>
                <Th width="20%" />
              </Tr>
            </Thead>
            <Tbody>
              {filteredContracts?.map((item) => (
                <Tr
                  transition="all .25s ease-in-out"
                  _hover={{ bg: "gray.900" }}
                  key={item.name + item.contractAddress + item.description}
                  sx={{
                    "& td:first-of-type": { pl: "48px" },
                    "& td:last-of-type": { pr: "48px" },
                    "> td": { borderColor: "divider.main" },
                  }}
                  onClick={() =>
                    router.push({
                      pathname: `/contract/${item.contractAddress}`,
                    })
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
                            bg="primary.dark"
                            placement="top"
                          >
                            <InfoIcon
                              color="gray.600"
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
                      {/* TODO save contract */}
                      {/* <AddToOtherList
                        contractInfo={item}
                        triggerElement={
                          <Icon
                            as={MdBookmarkBorder}
                            boxSize={6}
                            color="gray.600"
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
