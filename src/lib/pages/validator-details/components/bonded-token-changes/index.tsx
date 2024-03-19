import { Box, Flex } from "@chakra-ui/react";

import {
  RelatedTransactionsMobileCard,
  RelatedTransactionTable,
} from "../tables";
import { useMobile } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { TableTitle } from "lib/components/table";
import { useValidatorDelegationRelatedTxs } from "lib/services/validatorService";
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
        {isMobile ? (
          <RelatedTransactionsMobileCard
            delegationRelatedTxs={data?.items}
            isLoading={isLoading}
            assetInfos={assetInfos}
          />
        ) : (
          <>
            <TableTitle
              title="Delegation-Related Transactions"
              count={data?.total ?? 0}
              id={tableHeaderId}
              helperText="Shows transactions relevant to changes in delegated tokens, excluding any token reduction due to slashing."
            />
            <RelatedTransactionTable
              delegationRelatedTxs={data?.items}
              isLoading={isLoading}
              assetInfos={assetInfos}
            />
          </>
        )}
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
