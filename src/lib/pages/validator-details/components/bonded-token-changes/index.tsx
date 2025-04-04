import { Box, Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableTitle } from "lib/components/table";
import { useValidatorDelegationRelatedTxs } from "lib/services/validator";
import type {
  AssetInfos,
  MovePoolInfos,
  Option,
  ValidatorAddr,
} from "lib/types";

import { VotingPowerChart } from "./VotingPowerChart";
import { DelegationRelatedTxsTable } from "../tables";

interface BondedTokenChangesProps {
  validatorAddress: ValidatorAddr;
  singleStakingDenom: Option<string>;
  assetInfos: Option<AssetInfos>;
  movePoolInfos: Option<MovePoolInfos>;
}

export const BondedTokenChanges = ({
  validatorAddress,
  singleStakingDenom,
  assetInfos,
  movePoolInfos,
}: BondedTokenChangesProps) => {
  const isMobile = useMobile();

  const {
    pagesQuantity,
    setTotalData,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data, isLoading } = useValidatorDelegationRelatedTxs(
    validatorAddress,
    pageSize,
    offset,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  const tableHeaderId = "relatedTransactionTableHeader";

  return (
    <Flex direction="column" gap={{ base: 4, md: 8 }} pt={6}>
      <VotingPowerChart
        validatorAddress={validatorAddress}
        singleStakingDenom={singleStakingDenom}
        assetInfos={assetInfos}
      />
      <Box>
        {!isMobile && (
          <TableTitle
            title="Delegation-related transactions"
            count={data?.total ?? 0}
            id={tableHeaderId}
            helperText="Shows transactions relevant to changes in delegated tokens, excluding any token reduction due to slashing."
          />
        )}
        <DelegationRelatedTxsTable
          delegationRelatedTxs={data?.items}
          isLoading={isLoading}
          assetInfos={assetInfos}
          movePoolInfos={movePoolInfos}
        />
        {!!data?.total && data.total > 10 && (
          <Pagination
            currentPage={currentPage}
            pagesQuantity={pagesQuantity}
            offset={offset}
            totalData={data.total}
            scrollComponentId={tableHeaderId}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(e) => {
              const size = Number(e.target.value);
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </Box>
    </Flex>
  );
};
