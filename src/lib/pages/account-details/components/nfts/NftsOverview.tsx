import { Box, Divider } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { EmptyState } from "lib/components/state";
import { MobileTitle, TableTitle, ViewMore } from "lib/components/table";
import { useNftTokenListByAddressPagination } from "lib/services/nft";
import type { HexAddr } from "lib/types";

import { NftList } from "./NftList";

export const NftsOverview = ({
  userAddress,
  totalCount,
  onViewMore,
}: {
  userAddress: HexAddr;
  totalCount?: number;
  onViewMore?: () => void;
}) => {
  const { data: nfts, isFetching } = useNftTokenListByAddressPagination(
    userAddress,
    5,
    0
  );

  const isMobile = useMobile();
  return (
    <Box mt={{ base: 4, md: 8 }} mb={{ base: 0, md: 8 }}>
      {isMobile ? (
        <MobileTitle title="NFTs" count={totalCount} onViewMore={onViewMore} />
      ) : (
        <>
          <TableTitle title="NFTs" showCount count={totalCount} />
          <NftList
            nfts={nfts}
            isLoading={isFetching}
            emptyState={
              <EmptyState
                message="There are currently no NFTs held by this account."
                imageVariant="empty"
              />
            }
          />
          {onViewMore && !!totalCount && totalCount > 5 && (
            <ViewMore onClick={onViewMore} />
          )}
          <Divider pt="32px" borderColor="gray.700" opacity={1} />
        </>
      )}
    </Box>
  );
};
