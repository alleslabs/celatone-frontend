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
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { MdBookmarkBorder, MdHowToVote } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import type { Code } from "lib/services/publicProject";

interface CodesTableProps {
  codes: Code[];
  hasSearchInput?: boolean;
}
export const CodesTable = ({
  codes = [],
  hasSearchInput = true,
}: CodesTableProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredCodes = useMemo(() => {
    return matchSorter(codes, searchKeyword, {
      keys: ["id", "description"],
    });
  }, [codes, searchKeyword]);
  const router = useRouter();
  return (
    <Box>
      {hasSearchInput && (
        <Flex px="12">
          <TextInput
            variant="floating"
            value={searchKeyword}
            setInputState={setSearchKeyword}
            label="Search with code ID or code description"
            size="md"
            mb={6}
          />
        </Flex>
      )}
      {!filteredCodes.length ? (
        <Flex my={8}>
          <EmptyState message="No matched code found." />
        </Flex>
      ) : (
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
              {/* TODO Link code id and row to code detail */}
              {filteredCodes?.map((code) => (
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
                  onClick={() => router.push({ pathname: `/code/${code.id}` })}
                  cursor="pointer"
                >
                  <Td width="10%" color="primary.main">
                    <ExplorerLink
                      type="code_id"
                      value={code.id.toString()}
                      canCopyWithHover
                    />
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
                      <Button
                        variant="outline-gray"
                        size="sm"
                        onClick={() => {}}
                      >
                        <Icon as={MdHowToVote} boxSize={4} mr={1} />
                        Instantiate
                      </Button>
                      {/* TODO save code */}
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
      )}
    </Box>
  );
};
