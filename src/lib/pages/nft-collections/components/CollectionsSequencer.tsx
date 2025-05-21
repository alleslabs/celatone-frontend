import { Stack } from "@chakra-ui/react";
import InputWithIcon from "lib/components/InputWithIcon";
import { LoadNext } from "lib/components/LoadNext";
import { useDebounce } from "lib/hooks";
import { useNftCollectionsSequencer } from "lib/services/nft-collection";
import { useState } from "react";

import { CollectionList } from "./CollectionList";

export const CollectionsSequencer = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNftCollectionsSequencer(10, debouncedSearch);

  return (
    <>
      <Stack spacing={8}>
        <InputWithIcon
          amptrackSection="nft-collections-list-search"
          autoFocus
          placeholder="Search with collection name or collection VM address"
          size={{ base: "md", md: "lg" }}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <CollectionList collections={data} isLoading={isLoading} />
      </Stack>
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
