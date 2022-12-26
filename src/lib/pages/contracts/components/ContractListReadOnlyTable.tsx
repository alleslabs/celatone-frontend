import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ContractInfo } from "lib/stores/contract";

import { ContractNameCell } from "./table/ContractNameCell";
import { TagsCell } from "./table/TagsCell";

interface ContractListReadOnlyTableProps {
  contracts: ContractInfo[];
  onContractSelect: (addr: string) => void;
}
export const ContractListReadOnlyTable = ({
  contracts = [],
  onContractSelect,
}: ContractListReadOnlyTableProps) => {
  return (
    <TableContainer w="full" my="16px">
      <Table variant="simple" sx={{ tableLayout: "auto" }}>
        <Thead>
          <Tr>
            <Th width="10%">Contract Address</Th>
            <Th width="50%">Contract Name</Th>
            <Th width="30%">Tags</Th>
            <Th width="10%">Instantiator</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contracts.map((item) => (
            <Tr
              transition="all .25s ease-in-out"
              _hover={{ bg: "gray.900" }}
              key={item.contractAddress}
              onClick={() => {
                onContractSelect(item.contractAddress);
              }}
              cursor="pointer"
            >
              <Td width="10%">
                <ExplorerLink
                  value={item.contractAddress}
                  type="contract_address"
                  isReadOnly
                />
              </Td>
              <Td width="40%">
                <ContractNameCell contract={item} isReadOnly />
              </Td>
              <Td width="30%">
                <TagsCell contractInfo={item} isReadOnly />
              </Td>
              <Td width="10%">
                <ExplorerLink
                  value={item.instantiator}
                  type="user_address"
                  isReadOnly
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
