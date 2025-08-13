import type { FtChange } from "@initia/tx-decoder";

import { Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";

import { BalanceChangesToken } from "./balance-changes-token";

interface BalanceChangesMobileCardProps {
  address: string;
  changes: FtChange;
}

export const BalanceChangesMobileCard = ({
  address,
  changes,
}: BalanceChangesMobileCardProps) => {
  const getAddressType = useGetAddressType();
  const changeEntries = Object.entries(changes);

  return (
    <Stack bg="gray.900" p={3} rounded={8} spacing={3}>
      <Flex align="center" gap={2}>
        <Text color="text.dark" fontWeight={600} variant="body2">
          Address
        </Text>
        <ExplorerLink
          showCopyOnHover
          textVariant="body2"
          type={getAddressType(address)}
          value={address}
        />
      </Flex>
      <Divider borderColor="gray.700" />
      <Stack gap={2}>
        <Text color="text.dark" fontWeight={600} variant="body2">
          Balance changes
        </Text>
        {changeEntries.map(([denom, amount]) => (
          <BalanceChangesToken
            key={`${address}-${denom}`}
            coin={new Coin(denom, amount)}
          />
        ))}
      </Stack>
    </Stack>
  );
};
