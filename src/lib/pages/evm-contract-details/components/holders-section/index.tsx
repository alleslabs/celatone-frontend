import { Box, Heading, Stack } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { HoldersTable } from "lib/components/table/holders";
import { useAssetInfos } from "lib/services/assetService";
import { useRichlistSequencer } from "lib/services/richlist";
import { useEffect, useState } from "react";

interface HoldersSectionProps {
  contractAddress: string;
}

export const HoldersSection = ({ contractAddress }: HoldersSectionProps) => {
  const [isReversed, setIsReversed] = useState(false);
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

  // Note: The API's reverse=true shows highest holders first (descending order).
  // We pass !isReversed because when isReversed=false (default), we want reverse=true (top holders).
  // When user toggles to isReversed=true, we pass reverse=false (lowest holders first).
  const { data, error, isLoading } = useRichlistSequencer(
    evmDenom,
    pageSize,
    offset,
    !isReversed, // API reverse parameter: true = descending (top holders), false = ascending
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

  if (!data || !data.holders || data.holders.length === 0) {
    return (
      <EmptyState
        imageVariant="empty"
        message="No holders found for this contract."
      />
    );
  }

  // Calculate dynamic heading count
  // Cap at 100 for UI display, but use actual total if less than 100
  const displayCount = data?.pagination?.total
    ? Math.min(data.pagination.total, 100)
    : 100;

  return (
    <Stack
      gap={{
        base: 4,
        md: 6,
      }}
    >
      <Heading as="h5" fontWeight={700} variant="h5">
        Top {displayCount} Holders
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
          isReversed={isReversed}
          offset={offset}
          onToggleSort={() => setIsReversed(!isReversed)}
        />
        {data?.pagination?.total && data.pagination.total > 10 && (
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
