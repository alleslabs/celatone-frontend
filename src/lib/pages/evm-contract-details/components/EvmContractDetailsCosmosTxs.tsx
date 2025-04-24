import type { BechAddr20 } from "lib/types";

import { Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import { useTxsByAddressSequencer } from "lib/services/tx";

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
              <Text color="text.dark" mt={2} variant="body2">
                {data.length} Cosmos transactions found
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
