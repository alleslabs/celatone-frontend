import type { HexAddr32 } from "lib/types";

import { Box, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import { useNftMintInfo } from "lib/services/nft";
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
    <Stack order={{ base: "1", md: "-1" }} spacing="16px">
      <Heading as="h6" fontWeight={600} variant="h6">
        Mint Information
      </Heading>
      <Box
        border="1px solid"
        borderColor="gray.700"
        borderRadius="8px"
        p="16px"
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
              ampCopierSection="nft-detail-mint-information"
              showCopyOnHover
              type="block_height"
              value={String(mintInfo.height)}
            />
          </LabelText>
          <LabelText helperText1="(VM Address)" label="Minted by">
            <ExplorerLink
              ampCopierSection="nft-detail-mint-information"
              showCopyOnHover
              type="user_address"
              value={bech32AddressToHex(mintInfo.minter)}
            />
          </LabelText>
          <LabelText label="Minted Transaction">
            <ExplorerLink
              ampCopierSection="nft-detail-mint-information"
              showCopyOnHover
              type="tx_hash"
              value={mintInfo.txhash.toUpperCase()}
            />
          </LabelText>
        </SimpleGrid>
      </Box>
    </Stack>
  );
};
