import { Flex } from "@chakra-ui/react";

import type { ContractDetail } from "lib/model/contract";

import { PublicContractDesc } from "./PublicContractDesc";
import { UserContractDesc } from "./UserContractDesc";

interface ContractDescProps {
  contractDetail: ContractDetail;
}
export const ContractDesc = ({ contractDetail }: ContractDescProps) => {
  return (
    <Flex gap={6}>
      <PublicContractDesc contractDetail={contractDetail} />
      <UserContractDesc contractDetail={contractDetail} />
    </Flex>
  );
};
