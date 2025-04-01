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
          templateColumns={isMobile ? "1fr" : "1fr 1fr 1fr"}
          spacing="24px"
        >
          <LabelText
            label="Minted block height"
            helperText1={formatUTC(mintInfo.timestamp)}
            helperText2={dateFromNow(mintInfo.timestamp)}
          >
            <ExplorerLink
              value={String(mintInfo.height)}
              type="block_height"
              showCopyOnHover
              ampCopierSection="nft-detail-mint-information"
            />
          </LabelText>
          <LabelText label="Minted by" helperText1="(VM Address)">
            <ExplorerLink
              value={bech32AddressToHex(mintInfo.minter)}
              type="user_address"
              showCopyOnHover
              ampCopierSection="nft-detail-mint-information"
            />
          </LabelText>
          <LabelText label="Minted transaction">
            <ExplorerLink
              value={mintInfo.txhash.toUpperCase()}
              type="tx_hash"
              showCopyOnHover
              ampCopierSection="nft-detail-mint-information"
            />
          </LabelText>
        </SimpleGrid>
      </Box>
    </Stack>
  );
};
