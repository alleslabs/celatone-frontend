import { Box } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { NftList } from "lib/components/nft";
import { EmptyState } from "lib/components/state";
import { MobileTitle, TableTitle, ViewMore } from "lib/components/table";
import { useNftsByAccountByCollection } from "lib/services/nft";
import type { HexAddr } from "lib/types";

interface NftsOverviewProps {
  userAddress: HexAddr;
  totalCount?: number;
  onViewMore?: () => void;
}

export const NftsOverview = ({
  userAddress,
  totalCount,
  onViewMore,
}: NftsOverviewProps) => {
  const isMobile = useMobile();
  const { data, isFetching } = useNftsByAccountByCollection(userAddress, 5, 0);

  return (
    <Box mt={{ base: 4, md: 8 }} mb={{ base: 0, md: 8 }}>
      {isMobile ? (
        <MobileTitle title="NFTs" count={totalCount} onViewMore={onViewMore} />
      ) : (
        <>
          <TableTitle title="NFTs" showCount count={totalCount} />
          <NftList
            nfts={data?.nfts}
            isLoading={isFetching}
            emptyState={
              <EmptyState
                message="No NFTs are held by this account."
                withBorder
              />
            }
            showCollection
          />
          {onViewMore && !!totalCount && totalCount > 5 && (
            <ViewMore onClick={onViewMore} />
          )}
        </>
      )}
    </Box>
  );
};
