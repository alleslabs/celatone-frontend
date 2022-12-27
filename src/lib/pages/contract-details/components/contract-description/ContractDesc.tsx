import { Flex } from "@chakra-ui/react";
import router from "next/router";

import { useContractDetail } from "lib/model/contract";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { PublicContractDesc } from "./PublicContractDesc";
import { UserContractDesc } from "./UserContractDesc";

export const ContractDesc = () => {
  /**
   * @todos
   * - Make an interface
   * - Wireup with real query/execute commands data
   */
  const contractAddress = getFirstQueryParam(router.query.contractAddress);
  const contractDetail = useContractDetail(contractAddress as ContractAddr);

  return (
    <Flex gap={6}>
      {contractDetail?.publicInfo?.description && <PublicContractDesc />}
      <UserContractDesc />
    </Flex>
  );
};
