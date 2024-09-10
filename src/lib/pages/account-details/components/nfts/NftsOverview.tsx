import { Box, Flex } from "@chakra-ui/react";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";
import { useMobile, useTierConfig } from "lib/app-provider";
import { NftList } from "lib/components/nft";
import { MobileTitle, ViewMore } from "lib/components/table";
import {
  useNftsByAccountAddress,
  useNftsByAccountByCollectionSequencer,
} from "lib/services/nft";
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
  const { isFullTier, isSequencerTier } = useTierConfig();
  const limit = 5;
  const accountNftsFull = useNftsByAccountAddress(
    userAddress,
    limit,
    0,
    undefined,
    undefined,
    {
      enabled: isFullTier,
    }
  );
  const accountNftsSequencer = useNftsByAccountByCollectionSequencer(
    userAddress,
    undefined,
    undefined,
    isSequencerTier
  );

  const { data, isFetching } = isFullTier
    ? accountNftsFull
    : accountNftsSequencer;

  return (
    <Box mt={{ base: 4, md: 8 }} mb={{ base: 0, md: 8 }}>
      {isMobile ? (
        <MobileTitle title="NFTs" count={totalCount} onViewMore={onViewMore} />
      ) : (
        <AccountSectionWrapper title="NFTs" totalData={totalCount}>
          <Flex
            direction="column"
            borderBottom={data?.items?.length ? "1px solid" : "0px"}
            borderBottomColor="gray.700"
            mb={data?.items?.length ?? 12}
            pb={data?.items?.length ?? 8}
          >
            <NftList
              nfts={data?.items.slice(0, limit)}
              isLoading={isFetching}
              emptyState={
                <AccountDetailsEmptyState message="No NFTs are held by this account." />
              }
              showCollection
            />
            {onViewMore && !!totalCount && totalCount > 5 && (
              <ViewMore onClick={onViewMore} />
            )}
          </Flex>
        </AccountSectionWrapper>
      )}
    </Box>
  );
};
