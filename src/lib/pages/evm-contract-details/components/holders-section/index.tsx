import type { HexAddr20 } from "lib/types";

import { Box, Heading, Stack } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { HoldersTable } from "lib/components/table/holders";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmTotalSupply } from "lib/services/evm";
import { useRichlistSequencer } from "lib/services/richlist";
import { useEffect } from "react";

interface HoldersSectionProps {
  contractAddress: HexAddr20;
}

export const HoldersSection = ({ contractAddress }: HoldersSectionProps) => {
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

  const evmDenom = contractAddress.replace("0x", "evm/");
  const { data: assetInfos } = useAssetInfos({ withPrices: true });
  const {
    data: totalSupply,
    error: totalSupplyError,
    isLoading: totalSupplyLoading,
  } = useEvmTotalSupply(contractAddress);

  const { data, error, isLoading } = useRichlistSequencer(
    evmDenom,
    pageSize,
    offset,
    true, // reverse=true shows highest holders first (descending order)
    true
  );

  // Update total when data changes
  useEffect(() => {
    if (data?.pagination?.total) {
      setTotalData(data.pagination.total);
    }
  }, [data?.pagination?.total, setTotalData]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorFetching dataName="holders" />;

  return (
    <Stack
      gap={{
        base: 4,
        md: 6,
      }}
    >
      <Heading as="h5" fontWeight={700} variant="h5">
        Top holders
      </Heading>
      <Box>
        <HoldersTable
          assetInfos={assetInfos}
          emptyState={
            <EmptyState
              imageVariant="empty"
              message="No holders found for this contract."
            />
          }
          evmDenom={evmDenom}
          holders={data?.holders ?? []}
          isLoading={isLoading}
          offset={offset}
          totalSupply={totalSupply ?? null}
          totalSupplyError={!!totalSupplyError}
          totalSupplyLoading={totalSupplyLoading}
        />
        {!!data?.pagination?.total && data.pagination.total > 10 && (
          <Pagination
            currentPage={currentPage}
            offset={offset}
            pageSize={pageSize}
            pagesQuantity={pagesQuantity}
            totalData={data.pagination.total}
            onPageChange={setCurrentPage}
            onPageSizeChange={(e) => {
              const size = Number(e.target.value);
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </Box>
    </Stack>
  );
};
