import { Flex, Grid, Heading, Spinner, Stack, Text } from "@chakra-ui/react";

import type { TxsTabIndex } from "../types";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { AssetsSection } from "lib/components/asset";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import type { BechAddr, BechAddr20, Nullish, Option } from "lib/types";
import { dateFromNow, formatEvmTxHash, formatUTC } from "lib/utils";

import { EvmContractDetailsTxs } from "./EvmContractDetailsTxs";

interface EvmContractDetailsOverviewProps {
  contractAddress: BechAddr20;
  hash: Option<string>;
  evmHash: Nullish<string>;
  sender: Option<BechAddr>;
  created: Option<Date>;
  isContractInfoLoading: boolean;
  onViewMoreAssets: () => void;
  onViewMoreTxs: () => void;
  tab: TxsTabIndex;
  setTab: (tab: TxsTabIndex) => void;
}

export const EvmContractDetailsOverview = ({
  contractAddress,
  hash,
  evmHash,
  sender,
  created,
  isContractInfoLoading,
  onViewMoreAssets,
  onViewMoreTxs,
  tab,
  setTab,
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
          gridTemplateColumns={{
            base: "1fr",
            md: "minmax(0, 160px) repeat(3, minmax(0, 240px))",
          }}
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
                    showCopyOnHover
                  />
                ) : (
                  <Text variant="body2" color="text.disabled">
                    -
                  </Text>
                )}
              </>
            )}
          </LabelText>
          <LabelText label="Created Transaction">
            {isContractInfoLoading ? (
              <Spinner boxSize={4} />
            ) : (
              <Stack gap={0}>
                <Flex gap={1} alignItems="center">
                  <Text variant="body2" color="text.dark">
                    Cosmos:
                  </Text>
                  {hash ? (
                    <ExplorerLink value={hash} type="tx_hash" showCopyOnHover />
                  ) : (
                    <Text variant="body2" color="text.disabled">
                      -
                    </Text>
                  )}
                </Flex>
                <Flex gap={1} alignItems="center">
                  <Text variant="body2" color="text.dark">
                    EVM:
                  </Text>
                  {evmHash ? (
                    <ExplorerLink
                      value={formatEvmTxHash(evmHash)}
                      type="evm_tx_hash"
                      showCopyOnHover
                    />
                  ) : (
                    <Text variant="body2" color="text.disabled">
                      -
                    </Text>
                  )}
                </Flex>
              </Stack>
            )}
          </LabelText>
          <LabelText label="Created Time">
            {isContractInfoLoading ? (
              <Spinner boxSize={4} />
            ) : (
              <>
                {created ? (
                  <>
                    <Text variant="body2" color="text.dark">
                      {formatUTC(created)}
                    </Text>
                    <Text variant="body3" color="text.disabled">
                      ({dateFromNow(created)})
                    </Text>
                  </>
                ) : (
                  <Text variant="body2" color="text.disabled">
                    -
                  </Text>
                )}
              </>
            )}
          </LabelText>
        </Grid>
      </Stack>
      <AssetsSection address={contractAddress} onViewMore={onViewMoreAssets} />
      <EvmContractDetailsTxs
        address={contractAddress}
        onViewMore={onViewMoreTxs}
        tab={tab}
        setTab={setTab}
      />
    </Stack>
  );
};
