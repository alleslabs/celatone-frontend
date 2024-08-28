import { Grid, Heading, Spinner, Stack, Text } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import type { BechAddr, Option } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface EvmContractDetailsOverviewProps {
  hash: Option<string>;
  sender: Option<BechAddr>;
  created: Option<Date>;
  isContractInfoLoading: boolean;
}

export const EvmContractDetailsOverview = ({
  hash,
  sender,
  created,
  isContractInfoLoading,
}: EvmContractDetailsOverviewProps) => {
  const { currentChainId } = useCelatoneApp();
  const formatAddresses = useFormatAddresses();

  return (
    <Stack gap={8}>
      <Stack gap={4}>
        <Heading as="h6" variant="h6">
          Contract Info
        </Heading>
        <Grid
          gridTemplateColumns="160px 240px 1fr"
          padding={4}
          border="1px solid"
          borderColor="gray.700"
          borderRadius={8}
          gap={6}
        >
          <LabelText label="Network">{currentChainId}</LabelText>
          <LabelText label="Creator Address">
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
      <Stack gap={4}>
        <Heading as="h6" variant="h6">
          Assets
        </Heading>
        <Text>Assets</Text>
      </Stack>
      <Stack gap={4}>
        <Heading as="h6" variant="h6">
          Transactions
        </Heading>
        <Text>Txs</Text>
      </Stack>
    </Stack>
  );
};
