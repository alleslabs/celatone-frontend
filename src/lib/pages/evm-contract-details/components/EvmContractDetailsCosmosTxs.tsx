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
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTxsByAddressSequencer(address, undefined);

  return (
    <>
      <TransactionsTable
        transactions={!onViewMore ? data : data?.slice(0, 5)}
        isLoading={isLoading}
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
        showRelations={false}
      />
      {data && (
        <>
          {!onViewMore && (
            <>
              <Text variant="body2" color="text.dark" mt={2}>
                {data.length} Cosmos transactions found
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
                  text="Load more 10 transactions"
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
