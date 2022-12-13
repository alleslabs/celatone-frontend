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

import { ContractName } from "./table/ContractNameCell";
import { Tags } from "./table/TagsCell";

interface ContractListReadOnlyProps {
  contracts: ContractInfo[];
  onContractSelect: (addr: string) => void;
}
export const ContractListReadOnly = ({
  contracts = [],
  onContractSelect,
}: ContractListReadOnlyProps) => {
  return (
    <TableContainer w="full" my="16px">
      <Table variant="simple">
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
              key={item.address}
              onClick={() => {
                onContractSelect(item.address);
              }}
              cursor="pointer"
            >
              <Td width="10%">
                <ExplorerLink
                  value={item.address}
                  type="contract_address"
                  isReadOnly
                  canCopy={false}
                />
              </Td>
              <Td width="40%">
                <ContractName contractInfo={item} isReadOnly />
              </Td>
              <Td width="30%">
                <Tags contractInfo={item} isReadOnly />
              </Td>
              {/* Instantiator */}
              {/* TODO: make AddressRender later, check if address match wallet address => show 'Me' instead */}
              <Td width="10%">
                <ExplorerLink
                  type="user_address"
                  value={item.instantiator}
                  isReadOnly
                  canCopy={false}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
