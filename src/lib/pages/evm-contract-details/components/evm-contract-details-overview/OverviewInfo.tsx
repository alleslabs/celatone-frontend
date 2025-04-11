import type { BechAddr, Nullish, Option } from "lib/types";

import { Flex, Grid, Spinner, Stack, Text } from "@chakra-ui/react";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { dateFromNow, formatEvmTxHash, formatUTC } from "lib/utils";

interface OverviewInfoProps {
  hash: Option<string>;
  evmHash: Nullish<string>;
  sender: Option<BechAddr>;
  created: Option<Date>;
  isContractInfoLoading: boolean;
}

export const OverviewInfo = ({
  hash,
  evmHash,
  sender,
  created,
  isContractInfoLoading,
}: OverviewInfoProps) => {
  const isMobile = useMobile();
  const { currentChainId } = useCelatoneApp();
  const formatAddresses = useFormatAddresses();

  return (
    <Grid
      bg="gray.900"
      borderRadius={8}
      columnGap={{
        base: 14,
        "2xl": 36,
      }}
      gridTemplateColumns={{
        base: "1fr",
        md: "repeat(4, max-content)",
      }}
      padding={4}
      rowGap={4}
    >
      <LabelText label="Network">{currentChainId}</LabelText>
      <LabelText
        helperText1={isMobile ? "(Wallet Address)" : undefined}
        label="Creator address"
      >
        {isContractInfoLoading ? (
          <Spinner boxSize={4} />
        ) : (
          <>
            {sender ? (
              <ExplorerLink
                type="user_address"
                value={formatAddresses(sender).hex}
              />
            ) : (
              <Text color="text.disabled" variant="body2">
                -
              </Text>
            )}
          </>
        )}
      </LabelText>
      <LabelText label="Created transaction">
        {isContractInfoLoading ? (
          <Spinner boxSize={4} />
        ) : (
          <Stack gap={0}>
            <Flex alignItems="center" gap={1}>
              <Text color="text.dark" variant="body2">
                Cosmos:
              </Text>
              {hash ? (
                <ExplorerLink type="tx_hash" value={hash} />
              ) : (
                <Text color="text.disabled" variant="body2">
                  -
                </Text>
              )}
            </Flex>
            <Flex alignItems="center" gap={1}>
              <Text color="text.dark" variant="body2">
                EVM:
              </Text>
              {evmHash ? (
                <ExplorerLink
                  type="evm_tx_hash"
                  value={formatEvmTxHash(evmHash)}
                />
              ) : (
                <Text color="text.disabled" variant="body2">
                  -
                </Text>
              )}
            </Flex>
          </Stack>
        )}
      </LabelText>
      <LabelText label="Created time">
        {isContractInfoLoading ? (
          <Spinner boxSize={4} />
        ) : (
          <>
            {created ? (
              <>
                <Text color="text.dark" variant="body2">
                  {formatUTC(created)}
                </Text>
                <Text color="text.disabled" variant="body3">
                  ({dateFromNow(created)})
                </Text>
              </>
            ) : (
              <Text color="text.disabled" variant="body2">
                -
              </Text>
            )}
          </>
        )}
      </LabelText>
    </Grid>
  );
};
