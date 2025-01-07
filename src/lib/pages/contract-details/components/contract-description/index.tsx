import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { PublicDescription } from "lib/components/PublicDescription";
import type { Contract } from "lib/services/types";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { Nullable, Option, PublicContractInfo } from "lib/types";

import { UserContractDesc } from "./UserContractDesc";

interface ContractDescProps {
  contract: Contract;
  contractLocalInfo: Option<ContractLocalInfo>;
  publicInfo: Nullable<PublicContractInfo>;
}
export const ContractDesc = ({
  contract,
  contractLocalInfo,
  publicInfo,
}: ContractDescProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      gap={{ base: 4, md: 6 }}
      mb={{ base: 0, md: 4 }}
      direction={{ base: "column", md: "row" }}
    >
      {publicInfo?.description && (
        <PublicDescription
          textLine={contractLocalInfo?.description ? 4 : 2}
          title="Public Contract Description"
          description={publicInfo.description}
          icon={<CustomIcon name="public-project" color="gray.600" />}
        />
      )}
      {!isMobile && contractLocalInfo && (
        <UserContractDesc
          contract={contract}
          contractLocalInfo={contractLocalInfo}
          publicInfo={publicInfo}
        />
      )}
    </Flex>
  );
};
