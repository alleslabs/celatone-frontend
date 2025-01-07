import { Box, Flex } from "@chakra-ui/react";

import { DelegationRelatedTxsTable } from "../tables";
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

interface BondedTokenChangesProps {
  assetInfos: Option<AssetInfos>;
  movePoolInfos: Option<MovePoolInfos>;
  singleStakingDenom: Option<string>;
  validatorAddress: ValidatorAddr;
}

export const BondedTokenChanges = ({
  assetInfos,
  movePoolInfos,
  singleStakingDenom,
  validatorAddress,
}: BondedTokenChangesProps) => {
  const isMobile = useMobile();

  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
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
    <Flex gap={{ base: 4, md: 8 }} pt={6} direction="column">
      <VotingPowerChart
        validatorAddress={validatorAddress}
        assetInfos={assetInfos}
        singleStakingDenom={singleStakingDenom}
      />
      <Box>
        {!isMobile && (
          <TableTitle
            id={tableHeaderId}
            helperText="Shows transactions relevant to changes in delegated tokens, excluding any token reduction due to slashing."
            title="Delegation-Related Transactions"
            count={data?.total ?? 0}
          />
        )}
        <DelegationRelatedTxsTable
          assetInfos={assetInfos}
          delegationRelatedTxs={data?.items}
          isLoading={isLoading}
          movePoolInfos={movePoolInfos}
        />
        {!!data?.total && data.total > 10 && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            pagesQuantity={pagesQuantity}
            offset={offset}
            onPageChange={setCurrentPage}
            onPageSizeChange={(e) => {
              const size = Number(e.target.value);
              setPageSize(size);
              setCurrentPage(1);
            }}
            scrollComponentId={tableHeaderId}
            totalData={data.total}
          />
        )}
      </Box>
    </Flex>
  );
};
