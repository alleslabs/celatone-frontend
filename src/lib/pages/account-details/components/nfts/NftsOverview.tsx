import type { BechAddr, HexAddr } from "lib/types";

import { Box, Divider, Flex } from "@chakra-ui/react";
import { useMobile, useTierConfig } from "lib/app-provider";
import { NftList } from "lib/components/nft";
import { MobileTitle, ViewMore } from "lib/components/table";
import {
  useNftsByAccountAddress,
  useNftsByAccountSequencer,
} from "lib/services/nft";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";

interface NftsOverviewProps {
  accountAddress: BechAddr;
  hexAddress: HexAddr;
  onViewMore?: () => void;
  totalCount?: number;
}

export const NftsOverview = ({
  accountAddress,
  hexAddress,
  onViewMore,
  totalCount,
}: NftsOverviewProps) => {
  const isMobile = useMobile();
  const { isFullTier, isSequencerTier } = useTierConfig();
  const limit = 5;
  const accountNftsFull = useNftsByAccountAddress(
    hexAddress,
    limit,
    0,
    undefined,
    undefined,
    {
      enabled: isFullTier,
    }
  );
  const accountNftsSequencer = useNftsByAccountSequencer(
    accountAddress,
    undefined,
    undefined,
    limit,
    isSequencerTier
  );

  const data = isFullTier
    ? accountNftsFull.data?.items
    : accountNftsSequencer.data;
  const isFetching = isFullTier
    ? accountNftsFull.isFetching
    : accountNftsSequencer.isFetching;

  return (
    <Box mb={{ base: 0, md: 8 }} mt={{ base: 4, md: 8 }}>
      {isMobile ? (
        <MobileTitle
          count={totalCount}
          showCount={!!totalCount}
          title="NFTs"
          onViewMore={onViewMore}
        />
      ) : (
        <AccountSectionWrapper
          showCount={!!totalCount}
          title="NFTs"
          totalData={totalCount}
        >
          <Flex direction="column">
            <NftList
              emptyState={
                <AccountDetailsEmptyState
                  borderBottomWidth="0px"
                  message="No NFTs are held by this account."
                />
              }
              isLoading={isFetching}
              nfts={data}
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
