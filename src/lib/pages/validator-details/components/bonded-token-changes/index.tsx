import { Flex } from "@chakra-ui/react";

import { RelatedTransactionTable } from "../tables/RelatedTransactionsTable";
import type { AssetInfos, Option, ValidatorAddr } from "lib/types";

import { VotingPowerChart } from "./VotingPowerChart";

interface BondedTokenChangesProps {
  validatorAddress: ValidatorAddr;
  singleStakingDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
}

export const BondedTokenChanges = ({
  validatorAddress,
  singleStakingDenom,
  assetInfos,
}: BondedTokenChangesProps) => (
  <Flex direction="column" gap={{ base: 4, md: 8 }} pt={6}>
    <VotingPowerChart
      validatorAddress={validatorAddress}
      singleStakingDenom={singleStakingDenom}
      assetInfos={assetInfos}
    />
    <RelatedTransactionTable />
  </Flex>
);
