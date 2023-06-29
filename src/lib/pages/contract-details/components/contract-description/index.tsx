import { Flex } from "@chakra-ui/react";

import type { ContractData } from "../../types";
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
}: ContractDescProps) => (
  <Flex gap={6}>
    {publicProject.publicInfo?.description && (
      <PublicDescription
        title="Public Contract Description"
        description={publicProject.publicInfo.description}
        textLine={contractLocalInfo?.description ? 4 : 2}
        icon={<CustomIcon name="website" ml={0} mb={2} color="gray.600" />}
      />
    )}
    <UserContractDesc
      contractDetail={contractDetail}
      contractLocalInfo={contractLocalInfo}
      publicProject={publicProject}
    />
  </Flex>
);
