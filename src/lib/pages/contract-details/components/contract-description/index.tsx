import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { PublicDescription } from "lib/components/PublicDescription";
import type { Contract } from "lib/services/types";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { Nullable, Option, PublicContractInfo } from "lib/types";

import { UserContractDesc } from "./UserContractDesc";

interface ContractDescProps {
  publicInfo: Nullable<PublicContractInfo>;
  contract: Contract;
  contractLocalInfo: Option<ContractLocalInfo>;
}
export const ContractDesc = ({
  publicInfo,
  contract,
  contractLocalInfo,
}: ContractDescProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{ base: 4, md: 6 }}
      mb={{ base: 0, md: 4 }}
    >
      {publicInfo?.description && (
        <PublicDescription
          title="Public contract description"
          description={publicInfo.description}
          textLine={contractLocalInfo?.description ? 4 : 2}
          icon={<CustomIcon name="public-project" color="gray.600" />}
        />
      )}
      {!isMobile && contractLocalInfo && (
        <UserContractDesc
          publicInfo={publicInfo}
          contract={contract}
          contractLocalInfo={contractLocalInfo}
        />
      )}
    </Flex>
  );
};
