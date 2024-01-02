import { Text, Box, Stack, SimpleGrid, GridItem } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { useNFTMintInfo } from "lib/services/nftService";
import { dateFromNow, formatUTC } from "lib/utils";

const MintInfo = ({
  holderAddress,
  nftAddress,
}: {
  holderAddress: string;
  nftAddress: string;
}) => {
  const { data: mintInfo, isLoading } = useNFTMintInfo(nftAddress);

  const isMobile = useMobile();
  if (isLoading) return <Loading />;
  if (!mintInfo) return null;

  return (
    <Stack spacing="16px">
      <Text fontSize="18px" fontWeight={600}>
        Mint Information
      </Text>
      <Box
        p="16px"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="8px"
      >
        <SimpleGrid
          templateColumns={isMobile ? "1fr" : "1fr 1fr 1fr"}
          spacing="24px"
        >
          <GridItem>
            <Stack spacing="4px">
              <Text color="gray.400" fontWeight={700} fontSize="14px">
                Mint Block Height
              </Text>
              <ExplorerLink
                fontSize="14px"
                value={String(mintInfo.height)}
                type="block_height"
              />
              <Text fontSize="12px" color="gray.400">
                {formatUTC(mintInfo.timestamp)}
              </Text>
              <Text fontSize="12px" color="gray.400">
                {dateFromNow(mintInfo.timestamp)}
              </Text>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing="4px">
              <Text color="gray.400" fontWeight={700} fontSize="14px">
                Mint by
              </Text>
              <ExplorerLink
                fontSize="14px"
                value={holderAddress}
                type="user_address"
              />
              <Text fontSize="12px" color="gray.400">
                (Wallet Address)
              </Text>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing="4px">
              <Text color="gray.400" fontWeight={700} fontSize="14px">
                Mint Transaction
              </Text>
              <ExplorerLink
                fontSize="14px"
                value={mintInfo.txhash}
                type="tx_hash"
              />
            </Stack>
          </GridItem>
        </SimpleGrid>
      </Box>
    </Stack>
  );
};

export default MintInfo;
