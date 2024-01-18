import { Box, Divider } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { NftList } from "lib/components/nft";
import { EmptyState } from "lib/components/state";
import { MobileTitle, TableTitle, ViewMore } from "lib/components/table";
import { useNftsByAccount } from "lib/services/nft";
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
  const { data, isFetching } = useNftsByAccount(userAddress, 5, 0);

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
                message="There are currently no NFTs held by this account."
                imageVariant="empty"
              />
            }
            showCollection
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
