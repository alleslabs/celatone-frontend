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
  Icon,
  Box,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import Link from "next/link";
import { MdExpandMore } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Contract } from "lib/services/publicProject";

interface ContractsTableProps {
  contracts: Contract[];
}

export const ContractsTable = ({ contracts = [] }: ContractsTableProps) => {
  return (
    <Box>
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
            {contracts.map((item) => (
              <Tr
                transition="all .25s ease-in-out"
                _hover={{ bg: "gray.900" }}
                key={item.name + item.contractAddress + item.description}
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
                {/* Instantiator */}
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
                    {/* TODO Instantiator Info */}
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
      {contracts?.length > 5 ?? (
        <Flex w="full" justifyContent="center" textAlign="center" py="4">
          <Button size="sm" variant="ghost" color="gray.500">
            View More <Icon as={MdExpandMore} boxSize={4} ml="1" />
          </Button>
        </Flex>
      )}
    </Box>
  );
};
