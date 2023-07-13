import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { PublicDescription } from "lib/components/PublicDescription";
import type { ContractData } from "lib/types";

import { UserContractDesc } from "./UserContractDesc";

interface ContractDescProps {
  contractData: ContractData;
}
export const ContractDesc = ({ contractData }: ContractDescProps) => {
  const isMobile = useMobile();
  return (
    <Flex
      gap={{ base: 4, md: 6 }}
      direction={{ base: "column", md: "row" }}
      mt={{ base: 4, md: 0 }}
      mb={4}
    >
      {contractData.publicProject.publicInfo?.description && (
        <PublicDescription
          title="Public Contract Description"
          description={contractData.publicProject.publicInfo.description}
          textLine={contractData.contractLocalInfo?.description ? 4 : 2}
          icon={<CustomIcon name="public-project" color="gray.600" />}
        />
      )}
      {!isMobile && <UserContractDesc contractData={contractData} />}
    </Flex>
  );
};
