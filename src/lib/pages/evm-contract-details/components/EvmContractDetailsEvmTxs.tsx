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
    cosmosTxsCount,
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
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
              <Text mt={2} variant="body2" color="text.dark">
                {isFetchingNextPage ? (
                  <Spinner as="span" mr={1} size="xs" />
                ) : (
                  data.length
                )}{" "}
                EVM Txs found from {cosmosTxsCount ?? 0} Cosmos Txs
              </Text>
              {isError && (
                <Text mt={2} variant="body2" color="warning.main">
                  <CustomIcon ml={0} name="alert-triangle-solid" boxSize={3} />{" "}
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
