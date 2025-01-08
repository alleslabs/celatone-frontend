import { Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import { useTxsByAddressSequencer } from "lib/services/tx";
import type { BechAddr20 } from "lib/types";

interface EvmContractDetailsCosmosTxsProps {
  address: BechAddr20;
  onViewMore?: () => void;
}

export const EvmContractDetailsCosmosTxs = ({
  address,
  onViewMore,
}: EvmContractDetailsCosmosTxsProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
  } = useTxsByAddressSequencer(address, undefined);

  return (
    <>
      <TransactionsTable
        emptyState={
          data === undefined ? (
            <ErrorFetching dataName="cosmos transactions" />
          ) : (
            <EmptyState
              imageVariant="empty"
              message="There are no transactions on this contract."
            />
          )
        }
        isLoading={isLoading}
        showRelations={false}
        transactions={!onViewMore ? data : data?.slice(0, 5)}
      />
      {data && (
        <>
          {!onViewMore && (
            <>
              <Text mt={2} variant="body2" color="text.dark">
                {data.length} Cosmos transactions found
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
                  text="Load more 10 transactions"
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
