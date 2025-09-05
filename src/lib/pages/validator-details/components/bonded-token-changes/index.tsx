import type {
  AssetInfos,
  MovePoolInfos,
  Option,
  ValidatorAddr,
} from "lib/types";

import { Box, Flex } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableTitle } from "lib/components/table";
import { useQueryEvents } from "lib/hooks";
import { useValidatorDelegationRelatedTxs } from "lib/services/validator";

import { DelegationRelatedTxsTable } from "../tables";
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

  const validatorDelegationRelatedTxsQuery = useValidatorDelegationRelatedTxs(
    validatorAddress,
    pageSize,
    offset
  );
  useQueryEvents(validatorDelegationRelatedTxsQuery, {
    onSuccess: ({ total }) => setTotalData(total),
  });
  const { data, isLoading } = validatorDelegationRelatedTxsQuery;

  const tableHeaderId = "relatedTransactionTableHeader";

  return (
    <Flex direction="column" gap={{ base: 4, md: 8 }} pt={6}>
      <VotingPowerChart
        assetInfos={assetInfos}
        singleStakingDenom={singleStakingDenom}
        validatorAddress={validatorAddress}
      />
      <Box>
        {!isMobile && (
          <TableTitle
            id={tableHeaderId}
            count={data?.total ?? 0}
            helperText="Shows transactions relevant to changes in delegated tokens, excluding any token reduction due to slashing."
            title="Delegation-related transactions"
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
            offset={offset}
            pageSize={pageSize}
            pagesQuantity={pagesQuantity}
            scrollComponentId={tableHeaderId}
            totalData={data.total}
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
