import { Flex } from "@chakra-ui/react";

import { RelatedTransactionTable } from "../tables/RelatedTransactionsTable";
import type { AssetInfos, ValidatorAddr } from "lib/types";

import { VotingPowerChart } from "./VotingPowerChart";

interface BondedTokenChangesProps {
  validatorAddress: ValidatorAddr;
  singleStakingDenom?: string;
  assetInfos?: AssetInfos;
}

export const BondedTokenChanges = ({
  validatorAddress,
  singleStakingDenom,
  assetInfos,
}: BondedTokenChangesProps) => {
  return (
    <Flex direction="column" gap={{ base: 4, md: 8 }} pt={6}>
      <VotingPowerChart
        validatorAddress={validatorAddress}
        singleStakingDenom={singleStakingDenom}
        assetInfos={assetInfos}
      />
      <RelatedTransactionTable />
    </Flex>
  );
};
