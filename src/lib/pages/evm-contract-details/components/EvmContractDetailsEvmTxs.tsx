import { Spinner, Text } from "@chakra-ui/react";

import { useContractDetailsEvmTxs } from "../data";
import { CustomIcon } from "lib/components/icon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { EvmTransactionsTable, ViewMore } from "lib/components/table";
import type { BechAddr20 } from "lib/types";

interface EvmContractDetailsEvmTxsProps {
  address: BechAddr20;
  onViewMore?: () => void;
}

export const EvmContractDetailsEvmTxs = ({
  address,
  onViewMore,
}: EvmContractDetailsEvmTxsProps) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    cosmosTxsCount,
  } = useContractDetailsEvmTxs(address);

  return (
    <>
      <EvmTransactionsTable
        evmTransactions={!onViewMore ? data : data?.slice(0, 5)}
        isLoading={isLoading}
        emptyState={
          data === undefined ? (
            <ErrorFetching dataName="evm transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="There are no EVM transactions on this contract."
            />
          )
        }
        showTimestamp
      />
      {data && (
        <>
          {!onViewMore && (
            <>
              <Text variant="body2" color="text.dark" mt={2}>
                {isFetchingNextPage ? (
                  <Spinner as="span" size="xs" mr={1} />
                ) : (
                  data.length
                )}{" "}
                EVM Txs found from {cosmosTxsCount ?? 0} Cosmos Txs
              </Text>
              {isError && (
                <Text variant="body2" color="warning.main" mt={2}>
                  <CustomIcon name="alert-triangle-solid" boxSize={3} ml={0} />{" "}
                  There is an error during loading more transactions. Please try
                  again later.
                </Text>
              )}
            </>
          )}
          {hasNextPage && (
            <>
              {onViewMore ? (
                <ViewMore onClick={onViewMore} />
              ) : (
                <LoadNext
                  text="Load more transactions"
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
