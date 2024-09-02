import { Grid, Heading, Spinner, Stack, Text } from "@chakra-ui/react";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { AssetsSection } from "lib/components/asset";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import type { BechAddr, BechAddr20, Option } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { EvmContractDetailsTxs } from "./EvmContractDetailsTxs";

interface EvmContractDetailsOverviewProps {
  contractAddress: BechAddr20;
  hash: Option<string>;
  sender: Option<BechAddr>;
  created: Option<Date>;
  isContractInfoLoading: boolean;
  onViewMoreAssets: () => void;
  onViewMoreTxs: () => void;
}

export const EvmContractDetailsOverview = ({
  contractAddress,
  hash,
  sender,
  created,
  isContractInfoLoading,
  onViewMoreAssets,
  onViewMoreTxs,
}: EvmContractDetailsOverviewProps) => {
  const { currentChainId } = useCelatoneApp();
  const formatAddresses = useFormatAddresses();
  const isMobile = useMobile();

  return (
    <Stack gap={8}>
      <Stack gap={4}>
        <Heading as="h6" variant="h6">
          Contract Info
        </Heading>
        <Grid
          gridTemplateColumns={{ base: "1fr", md: "160px 240px 1fr" }}
          padding={4}
          border="1px solid"
          borderColor="gray.700"
          borderRadius={8}
          columnGap={6}
          rowGap={4}
        >
          <LabelText label="Network">{currentChainId}</LabelText>
          <LabelText
            label="Creator Address"
            helperText1={isMobile ? "(Wallet Address)" : undefined}
          >
            {isContractInfoLoading ? (
              <Spinner boxSize={4} />
            ) : (
              <>
                {sender ? (
                  <ExplorerLink
                    value={formatAddresses(sender).hex}
                    type="user_address"
                  />
                ) : (
                  "-"
                )}
              </>
            )}
          </LabelText>
          <LabelText label="Created Transaction">
            {isContractInfoLoading ? (
              <Spinner boxSize={4} />
            ) : (
              <Stack gap={1}>
                {hash ? <ExplorerLink value={hash} type="tx_hash" /> : "-"}
                {created && (
                  <>
                    <Text variant="body2" color="text.dark">
                      {formatUTC(created)}
                    </Text>
                    <Text variant="body3" color="text.disabled">
                      ({dateFromNow(created)})
                    </Text>
                  </>
                )}
              </Stack>
            )}
          </LabelText>
        </Grid>
      </Stack>
      <AssetsSection address={contractAddress} onViewMore={onViewMoreAssets} />
      <EvmContractDetailsTxs
        address={contractAddress}
        onViewMore={onViewMoreTxs}
      />
    </Stack>
  );
};
