import { Box, Flex } from "@chakra-ui/react";

import { AccountDetailsEmptyState } from "../AccountDetailsEmptyState";
import AccountSectionWrapper from "../AccountSectionWrapper";
import { useMobile, useTierConfig } from "lib/app-provider";
import { NftList } from "lib/components/nft";
import { MobileTitle, ViewMore } from "lib/components/table";
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
  const { isFullTier } = useTierConfig();

  const { data, isFetching } = useNftsByAccountByCollection(userAddress, 5, 0);

  return (
    <Box mt={{ base: 4, md: 8 }} mb={{ base: 0, md: 8 }}>
      {isMobile ? (
        <MobileTitle
          title="NFTs"
          count={totalCount}
          onViewMore={onViewMore}
          showCount={isFullTier}
        />
      ) : (
        <AccountSectionWrapper
          title="NFTs"
          totalData={totalCount}
          showCount={isFullTier}
        >
          <Flex
            direction="column"
            borderBottom={data?.nfts?.length ? "1px solid" : "0px"}
            borderBottomColor="gray.700"
            mb={data?.nfts?.length ?? 12}
            pb={data?.nfts?.length ?? 8}
          >
            <NftList
              nfts={data?.nfts}
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
