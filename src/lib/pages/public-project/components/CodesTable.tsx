// TODO combine with codestable in codelist
import {
  Button,
  TableContainer,
  Td,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Icon,
  Text,
  Flex,
  Box,
  Tag,
} from "@chakra-ui/react";
import { MdBookmarkBorder, MdExpandMore, MdHowToVote } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Code } from "lib/services/publicProject";

interface CodesTableProps {
  codes: Code[];
}
export const CodesTable = ({ codes = [] }: CodesTableProps) => {
  return (
    <Box>
      <TableContainer w="full">
        <Table variant="simple" sx={{ tableLayout: "auto" }}>
          <Thead>
            <Tr
              sx={{
                "& th:first-of-type": { pl: "48px" },
                "> th": {
                  textTransform: "capitalize",
                  borderColor: "divider.main",
                },
              }}
            >
              <Th width="10%">Code ID</Th>
              <Th width="30%">Code Description</Th>
              <Th width="10%" textAlign="center">
                Contracts
              </Th>
              <Th width="15%">Uploader</Th>
              <Th width="15%">Permission</Th>
              <Th width="20%" />
            </Tr>
          </Thead>
          <Tbody>
            {codes.map((code) => (
              <Tr
                key={code.id}
                sx={{
                  "& td:first-of-type": { pl: "48px" },
                  "& td:last-of-type": { pr: "48px" },
                  "> td": { borderColor: "divider.main" },
                }}
                _hover={{
                  bg: "gray.900",
                }}
              >
                <Td width="10%" color="primary.main">
                  <ExplorerLink value={code.id.toString()} canCopyWithHover />
                </Td>
                <Td width="45%">
                  <Text variant="body2"> {code.description}</Text>
                </Td>
                <Td width="10%" textAlign="center">
                  <Text>todo</Text>
                </Td>
                <Td width="15%">
                  <Text>todo</Text>
                </Td>
                <Td width="15%">
                  {/* TODO: add condition for permission tag */}
                  <Tag borderRadius="full" bgColor="gray.600">
                    Nobody
                  </Tag>
                  {/* <Tag borderRadius="full" bgColor="info.dark">
                    OnlyAddress
                  </Tag>
                  <Tag borderRadius="full" bgColor="info.dark">
                    AnyOfAddresses
                  </Tag>
                  <Tag borderRadius="full" bgColor="success.dark">
                    Everybody
                  </Tag> */}
                </Td>
                <Td width="20%">
                  <Flex gap={3} justifyContent="flex-end" alignItems="center">
                    <Button variant="outline-gray" size="sm" onClick={() => {}}>
                      <Icon as={MdHowToVote} boxSize={4} mr={1} />
                      Instantiate
                    </Button>
                    <Icon
                      as={MdBookmarkBorder}
                      boxSize={6}
                      color="gray.600"
                      cursor="pointer"
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {codes?.length > 5 && (
        <Flex w="full" justifyContent="center" textAlign="center" py="4">
          <Button size="sm" variant="ghost" color="gray.500">
            View More <Icon as={MdExpandMore} boxSize={4} ml="1" />
          </Button>
        </Flex>
      )}
    </Box>
  );
};
