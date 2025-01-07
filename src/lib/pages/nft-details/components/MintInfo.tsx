import { Box, Heading, SimpleGrid, Stack } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import { useNftMintInfo } from "lib/services/nft";
import type { HexAddr32 } from "lib/types";
import { bech32AddressToHex, dateFromNow, formatUTC } from "lib/utils";

interface MintInfoProps {
  nftAddress: HexAddr32;
}

export const MintInfo = ({ nftAddress }: MintInfoProps) => {
  const isMobile = useMobile();
  const { data: mintInfo, isLoading } = useNftMintInfo(nftAddress);

  if (isLoading) return <Loading />;
  if (!mintInfo) return null;
  return (
    <Stack spacing="16px" order={{ base: "1", md: "-1" }}>
      <Heading as="h6" variant="h6" fontWeight={600}>
        Mint Information
      </Heading>
      <Box
        p="16px"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="8px"
      >
        <SimpleGrid
          spacing="24px"
          templateColumns={isMobile ? "1fr" : "1fr 1fr 1fr"}
        >
          <LabelText
            helperText1={formatUTC(mintInfo.timestamp)}
            helperText2={dateFromNow(mintInfo.timestamp)}
            label="Minted Block Height"
          >
            <ExplorerLink
              type="block_height"
              value={String(mintInfo.height)}
              ampCopierSection="nft-detail-mint-information"
              showCopyOnHover
            />
          </LabelText>
          <LabelText helperText1="(VM Address)" label="Minted by">
            <ExplorerLink
              type="user_address"
              value={bech32AddressToHex(mintInfo.minter)}
              ampCopierSection="nft-detail-mint-information"
              showCopyOnHover
            />
          </LabelText>
          <LabelText label="Minted Transaction">
            <ExplorerLink
              type="tx_hash"
              value={mintInfo.txhash.toUpperCase()}
              ampCopierSection="nft-detail-mint-information"
              showCopyOnHover
            />
          </LabelText>
        </SimpleGrid>
      </Box>
    </Stack>
  );
};
