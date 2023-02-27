import { Flex } from "@chakra-ui/react";

import type { ContractData } from "lib/types";

import { PublicContractDesc } from "./PublicContractDesc";
import { UserContractDesc } from "./UserContractDesc";

interface ContractDescProps {
  contractData: ContractData;
}
export const ContractDesc = ({ contractData }: ContractDescProps) => (
  <Flex gap={6}>
    {contractData.publicProject.publicInfo?.description && (
      <PublicContractDesc contractData={contractData} />
    )}
    <UserContractDesc contractData={contractData} />
  </Flex>
);
