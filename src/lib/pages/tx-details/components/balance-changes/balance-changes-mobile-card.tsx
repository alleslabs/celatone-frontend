import type { Metadata } from "@initia/tx-decoder";
import type { LinkType } from "lib/components/ExplorerLink";

import { Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { ExplorerLink } from "lib/components/ExplorerLink";

import { BalanceChangeEvmNft } from "./balance-changes-evm-nft";
import { BalanceChangeNft } from "./balance-changes-nft";
import { BalanceChangesToken } from "./balance-changes-token";

interface BalanceChangesMobileCardProps {
  address: string;
  addressType: Exclude<LinkType, "function_name">;
  ftChangeEntries: [string, string][];
  metadata?: Metadata;
  nftChangeEntries?: [string, [string, string][]][];
  objectChangeEntries?: [string, string][];
}

export const BalanceChangesMobileCard = ({
  address,
  addressType,
  ftChangeEntries,
  metadata,
  nftChangeEntries = [],
  objectChangeEntries = [],
}: BalanceChangesMobileCardProps) => {
  return (
    <Stack bg="gray.900" p={3} rounded={8} spacing={3}>
      <Flex align="center" gap={2}>
        <Text color="text.dark" fontWeight={600} variant="body2">
          Address
        </Text>
        <ExplorerLink
          showCopyOnHover
          textVariant="body2"
          type={addressType}
          value={address}
        />
      </Flex>
      <Divider borderColor="gray.700" />
      <Stack gap={2}>
        <Text color="text.dark" fontWeight={600} variant="body2">
          Balance changes
        </Text>
        {ftChangeEntries.map(([denom, amount]) => (
          <BalanceChangesToken
            key={`${address}-${denom}`}
            coin={new Coin(denom, amount)}
          />
        ))}
        {metadata &&
          metadata.type === "move" &&
          objectChangeEntries.map(([id, change]) => (
            <BalanceChangeNft
              key={`${address}-${id}`}
              id={id}
              change={Number(change)}
              metadata={metadata}
            />
          ))}
        {metadata &&
          metadata.type === "evm" &&
          nftChangeEntries.map(([contractAddress, tokenIdChanges]) =>
            tokenIdChanges.map(([tokenId, change]) => (
              <BalanceChangeEvmNft
                key={`${address}-${contractAddress}-${tokenId}`}
                change={Number(change)}
                contractAddress={contractAddress}
                metadata={metadata}
                tokenId={tokenId}
              />
            ))
          )}
      </Stack>
    </Stack>
  );
};
