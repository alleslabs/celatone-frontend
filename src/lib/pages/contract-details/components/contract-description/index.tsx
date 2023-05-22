import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { PublicDescription } from "lib/components/PublicDescription";
import type { ContractData } from "lib/types";

import { UserContractDesc } from "./UserContractDesc";

interface ContractDescProps {
  contractData: ContractData;
}
export const ContractDesc = ({ contractData }: ContractDescProps) => (
  <Flex gap={6}>
    {contractData.publicProject.publicInfo?.description && (
      <PublicDescription
        title="Public Contract Description"
        description={contractData.publicProject.publicInfo.description}
        textLine={contractData.contractLocalInfo?.description ? 4 : 2}
        icon={<CustomIcon name="website" ml="0" mb="6px" color="gray.600" />}
      />
    )}
    <UserContractDesc contractData={contractData} />
  </Flex>
);
