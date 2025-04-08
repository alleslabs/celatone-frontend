import type { BechAddr20 } from "lib/types";

import { Spinner, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { EvmTransactionsTable, ViewMore } from "lib/components/table";

import { useContractDetailsEvmTxs } from "../data";

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
        evmTransactions={!onViewMore ? data : data?.slice(0, 5)}
        isLoading={isLoading}
        showTimestamp
      />
      {data && (
        <>
          {!onViewMore && (
            <>
              <Text color="text.dark" mt={2} variant="body2">
                {isFetchingNextPage ? (
                  <Spinner as="span" mr={1} size="xs" />
                ) : (
                  data.length
                )}{" "}
                EVM Txs found from {cosmosTxsCount ?? 0} Cosmos Txs
              </Text>
              {isError && (
                <Text color="warning.main" mt={2} variant="body2">
                  <CustomIcon boxSize={3} ml={0} name="alert-triangle-solid" />{" "}
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
                  fetchNextPage={fetchNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  text="Load more transactions"
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
