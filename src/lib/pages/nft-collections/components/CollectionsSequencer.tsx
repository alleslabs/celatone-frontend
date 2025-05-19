import { LoadNext } from "lib/components/LoadNext";
import { useNftCollectionsSequencer } from "lib/services/nft-collection";

import { CollectionList } from "./CollectionList";

export const CollectionsSequencer = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNftCollectionsSequencer();

  return (
    <>
      <CollectionList collections={data} isLoading={isLoading} />
      {hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more 10 collections"
        />
      )}
    </>
  );
};
