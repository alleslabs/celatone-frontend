import { Flex } from "@chakra-ui/react";

import type { ContractData } from "../../types";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { PublicDescription } from "lib/components/PublicDescription";

import { UserContractDesc } from "./UserContractDesc";

interface ContractDescProps {
  contractDetail: ContractData["contractDetail"];
  contractLocalInfo: ContractData["contractLocalInfo"];
  publicProject: ContractData["publicProject"];
}
export const ContractDesc = ({
  contractDetail,
  contractLocalInfo,
  publicProject,
}: ContractDescProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      gap={{ base: 4, md: 6 }}
      direction={{ base: "column", md: "row" }}
      mt={{ base: 4, md: 0 }}
      mb={4}
    >
      {publicProject.publicInfo?.description && (
        <PublicDescription
          title="Public Contract Description"
          description={publicProject.publicInfo.description}
          textLine={contractLocalInfo?.description ? 4 : 2}
          icon={<CustomIcon name="public-project" color="gray.600" />}
        />
      )}
      {!isMobile && (
        <UserContractDesc
          contractDetail={contractDetail}
          contractLocalInfo={contractLocalInfo}
          publicProject={publicProject}
        />
      )}
    </Flex>
  );
};
