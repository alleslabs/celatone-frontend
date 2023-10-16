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
      direction={{ base: "column", md: "row" }}
      mt={{ base: 0, md: 0 }}
      mb={4}
      gap={{ base: 4, md: 6 }}
      pb={{ base: 0, md: 8 }}
      borderBottom={{ base: "0px", md: "1px solid" }}
      borderBottomColor={{ base: "transparent", md: "gray.700" }}
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
