import { Flex, Grid, Spinner, Stack, Text } from "@chakra-ui/react";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { BechAddr, Nullish, Option } from "lib/types";
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
      gridTemplateColumns={{
        base: "1fr",
        md: "repeat(4, max-content)",
      }}
      padding={4}
      bg="gray.900"
      borderRadius={8}
      columnGap={{
        base: 14,
        "2xl": 36,
      }}
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
                <ExplorerLink value={hash} type="tx_hash" />
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
  );
};
