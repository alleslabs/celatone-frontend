import { Box, Stack, SimpleGrid, Heading } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import { useNftMintInfo } from "lib/services/nftService";
import type { HexAddr } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

const MintInfo = ({
  holderAddress,
  nftAddress,
}: {
  holderAddress: string;
  nftAddress: HexAddr;
}) => {
  const { data: mintInfo, isLoading } = useNftMintInfo(nftAddress);

  const isMobile = useMobile();
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
            label="Minted Block Height"
            helperText1={formatUTC(mintInfo.timestamp)}
            helperText2={dateFromNow(mintInfo.timestamp)}
          >
            <ExplorerLink
              value={String(mintInfo.height)}
              type="block_height"
              showCopyOnHover
            />
          </LabelText>
          <LabelText label="Minted by" helperText1="(VM Address)">
            <ExplorerLink
              value={holderAddress}
              type="user_address"
              showCopyOnHover
            />
          </LabelText>
          <LabelText label="Minted Transaction">
            <ExplorerLink
              value={mintInfo.txhash}
              type="tx_hash"
              showCopyOnHover
            />
          </LabelText>
        </SimpleGrid>
      </Box>
    </Stack>
  );
};

export default MintInfo;
