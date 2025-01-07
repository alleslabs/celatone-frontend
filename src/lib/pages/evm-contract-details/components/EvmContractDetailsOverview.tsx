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
  created: Option<Date>;
  evmHash: Nullish<string>;
  hash: Option<string>;
  isContractInfoLoading: boolean;
  onViewMoreAssets: () => void;
  onViewMoreTxs: () => void;
  sender: Option<BechAddr>;
  setTab: (tab: TxsTabIndex) => void;
  tab: TxsTabIndex;
}

export const EvmContractDetailsOverview = ({
  contractAddress,
  created,
  evmHash,
  hash,
  isContractInfoLoading,
  onViewMoreAssets,
  onViewMoreTxs,
  sender,
  setTab,
  tab,
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
            helperText1={isMobile ? "(Wallet Address)" : undefined}
            label="Creator Address"
          >
            {isContractInfoLoading ? (
              <Spinner boxSize={4} />
            ) : (
              <>
                {sender ? (
                  <ExplorerLink
                    type="user_address"
                    value={formatAddresses(sender).hex}
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
                <Flex alignItems="center" gap={1}>
                  <Text variant="body2" color="text.dark">
                    Cosmos:
                  </Text>
                  {hash ? (
                    <ExplorerLink type="tx_hash" value={hash} showCopyOnHover />
                  ) : (
                    <Text variant="body2" color="text.disabled">
                      -
                    </Text>
                  )}
                </Flex>
                <Flex alignItems="center" gap={1}>
                  <Text variant="body2" color="text.dark">
                    EVM:
                  </Text>
                  {evmHash ? (
                    <ExplorerLink
                      type="evm_tx_hash"
                      value={formatEvmTxHash(evmHash)}
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
        setTab={setTab}
        tab={tab}
        onViewMore={onViewMoreTxs}
      />
    </Stack>
  );
};
