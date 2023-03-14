import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { PublicDescription } from "lib/components/PublicDescription";
import type { ContractData } from "lib/types";
import { textLine } from "lib/utils";

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
        textLine={textLine(!contractData.contractLocalInfo?.description)}
        icon={<CustomIcon name="website" ml="0" my="0" />}
      />
    )}
    <UserContractDesc contractData={contractData} />
  </Flex>
);
