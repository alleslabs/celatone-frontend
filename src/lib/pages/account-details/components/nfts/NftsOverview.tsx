import type { HexAddr } from "lib/types";

import { Box, Divider, Flex } from "@chakra-ui/react";
import { useMobile, useTierConfig } from "lib/app-provider";
import { NftList } from "lib/components/nft";
import { MobileTitle, ViewMore } from "lib/components/table";
import {
  useNftsByAccountAddress,
  useNftsByAccountByCollectionSequencer,
} from "lib/services/nft";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";

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
    <Box mb={{ base: 0, md: 8 }} mt={{ base: 4, md: 8 }}>
      {isMobile ? (
        <MobileTitle count={totalCount} title="NFTs" onViewMore={onViewMore} />
      ) : (
        <AccountSectionWrapper title="NFTs" totalData={totalCount}>
          <Flex direction="column">
            <NftList
              emptyState={
                <AccountDetailsEmptyState
                  borderBottom={0}
                  message="No NFTs are held by this account."
                />
              }
              isLoading={isFetching}
              nfts={data?.items.slice(0, limit)}
              showCollection
            />
            {onViewMore && !!totalCount && totalCount > 5 && (
              <ViewMore onClick={onViewMore} />
            )}
            <Divider bg="gray.700" />
          </Flex>
        </AccountSectionWrapper>
      )}
    </Box>
  );
};
